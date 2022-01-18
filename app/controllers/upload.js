const _ = require('lodash')
const yaml = require('js-yaml')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const db = require('../models/index')
const path = require('path')
const Workbook = db.workbooks
const Section = db.sections
const View = db.views
const Problem = db.problems

function resizer (src, folder, option) {
  const file = uuidv4() + '.png'
  if (option === 0) {
    const dest = path.join(process.env.IMAGE_SOURCE, folder, file)
    sharp(fs.readFileSync(src)).resize({ width: 2000 }).toFormat('png').toFile(dest)
  } else {
    for (const width of [64, 128, 256]) {
      const dest = path.join(process.env.IMAGE_SOURCE, folder, width + 'x' + width, file)
      sharp(fs.readFileSync(src)).resize({ width: width }).toFormat('png').toFile(dest)
    }
  }
  return file
}

async function uploader (dir) {
  const doc = yaml.load(fs.readFileSync(path.join(dir, 'config.yaml'), 'utf8'))

  const workbook = doc.workbook
  if (workbook.bookcover !== undefined) {
    const imagedir = path.join(dir, workbook.bookcover)
    workbook.bookcover = resizer(imagedir, 'bookcover', 1)
  }
  const wid = (await Workbook.create(workbook)).wid

  const sections = doc.sections
  for (const section of sections) {
    section.wid = wid
    const imagedir = path.join(dir, section.sectioncover)
    section.sectioncover = resizer(imagedir, 'sectioncover', 1)

    const views = section.views
    const sid = (await Section.create(section)).get({ plain: true }).sid
    for (const view of views) {
      view.sid = sid
      if (view.material) { view.material = resizer(imagedir, 'material', 0) }
      const problems = view.problems
      for (const problem of problems) {
        problem.sid = sid
        if (problem.content) { problem.content = resizer(imagedir, 'content', 0) }
        if (problem.explanation) { problem.explanation = resizer(imagedir, 'explanation', 0) }
        await Problem.create(problem)
      }
      await View.create(view)
    }
  }
}

function validate (dir) {
  try {
    const doc = yaml.load(fs.readFileSync(path.join(dir, 'config.yaml'), 'utf8'))

    const workbook = doc.workbook
    if (!workbook) throw new Error(`${dir} does not have workbook`)
    if (!workbook.bookcover) {
      throw new Error(`${dir} workbook does not have bookcover`)
    }
    if (workbook.bookcover && !fs.existsSync(path.join(dir, workbook.bookcover))) {
      throw new Error(`${dir} workbook have wrong bookcover`)
    }

    let problemCnt = 0
    const sections = doc.sections
    if (!sections || sections.length === 0) {
      throw new Error(`${dir} does not have sections`)
    }
    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx]
      if (!section.sectioncover) {
        throw new Error(`${dir}, section[${sectionIdx}] does not have sectioncover`)
      }
      if (section.sectioncover && !fs.existsSync(path.join(dir, section.sectioncover))) {
        throw new Error(`${dir}, section[${sectionIdx}] have wrong sectioncover`)
      }
      const views = section.views
      if (!views || views.length === 0) {
        throw new Error(`${dir}, section[${sectionIdx}] does not have views`)
      }

      for (let viewIdx = 0; viewIdx < views.length; viewIdx++) {
        const view = views[viewIdx]
        /* if (view.form === 1 && !view.material) {
          throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}] does not have material`)
        } */
        if (view.material && !fs.existsSync(path.join(dir, view.material))) {
          throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}] has wrong material`)
        }
        const problems = view.problems
        if (!problems || problems.length === 0) {
          throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}] does not have problems`)
        }
        view.index_start = problemCnt + 1
        problemCnt += problems.length
        view.index_end = problemCnt

        const problemIndexList = []
        for (let problemIdx = 0; problemIdx < problems.length; problemIdx++) {
          const problem = problems[problemIdx]
          const type = problem.type
          if (problem.content && !fs.existsSync(path.join(dir, problem.content))) {
            throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}], problem[${problemIdx}] has wrong content`)
          }
          if (problem.explanation && !fs.existsSync(path.join(dir, problem.explanation))) {
            throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}], problem[${problemIdx}] has wrong explanation`)
          }
          if ([4, 5].includes(type)) {
            const answer = +problem.answer
            if (isNaN(answer) || answer < 1 || answer > type) {
              throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}], problem[${problemIdx}] has wrong answer`)
            }
          }
          const iconIdx = +problem.icon_index
          if (isNaN(iconIdx) || iconIdx < view.index_start || iconIdx > view.index_end) {
            throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}], problem[${problemIdx}] has wrong icon index`)
          }
          problemIndexList.push(problem.icon_index)
        }
        if (_.uniq(problemIndexList).length !== problems.length) {
          throw new Error(`${dir}, section[${sectionIdx}], view[${viewIdx}], has duplicate icon index`)
        }
      }
    }

    fs.writeFileSync(path.join(dir, 'config.yaml'), yaml.dump(doc))
    return true
  } catch (err) {
    console.log(String(err))
    return false
  }
}

exports.upload = async (req, res) => {
  try {
    const src = path.join(process.env.UPLOAD_SOURCE, req.params.title)
    const outers = fs.readdirSync(src)
    for (const outer of outers) {
      const inners = fs.readdirSync(path.join(src, outer))
      for (const inner of inners) {
        const dir = path.join(src, outer, inner)
        if (fs.existsSync(path.join(dir, 'config.yaml')) && validate(dir)) {
          await uploader(dir)
          console.log(dir)
        }
      }
    }
    res.send('done')
  } catch (err) {
    console.log(String(err))
    res.status(500).send(String(err))
  }
}
