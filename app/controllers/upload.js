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

function resizer (src, folder, file, width) {
  if (!fs.existsSync(src)) {
    console.log(src + ' does not exist')
    return
  }
  if (width === 0) {
    const dest =
      '/home/skyon' + '/data/images/' + folder + '/' + file

    fs.readFile(src, (err, data) => {
      sharp(data).resize({ width: 2000 }).toFormat('png').toFile(dest)
      if (err) throw err
    })
  } else {
    const dest =
      '/home/skyon' +
      '/data/images/' +
      folder +
      '/' +
      width +
      'x' +
      width +
      '/' +
      file

    fs.readFile(src, (err, data) => {
      sharp(data).resize({ width: width }).toFormat('png').toFile(dest)
      if (err) throw err
    })
  }
}

async function uploader (dir) {
  console.log(dir)
  const doc = yaml.load(fs.readFileSync(dir + '/config.yaml', 'utf8'))
  const workbook = doc.workbook
  if (!workbook) {
    console.log(dir + ' does not have workbook')
    return
  }
  if (workbook.bookcover !== undefined) {
    const imagedir = dir + '/' + workbook.bookcover
    workbook.bookcover = uuidv4() + '.png'
    resizer(imagedir, 'bookcover', workbook.bookcover, 256)
    resizer(imagedir, 'bookcover', workbook.bookcover, 128)
    resizer(imagedir, 'bookcover', workbook.bookcover, 64)
  }
  const wid = (await Workbook.create(workbook)).wid
  const sections = doc.sections
  if (!sections) {
    console.log(dir + ' does not have sections')
    return
  }
  const size = sections.length
  for (let i = 0; i < size; i++) {
    const section = sections[i]
    if (!section) {
      console.log(dir + ' does not have section')
      return
    }
    section.wid = wid
    if (section.sectioncover !== undefined) {
      const imagedir = dir + '/' + section.sectioncover
      section.sectioncover = uuidv4() + '.png'
      resizer(imagedir, 'sectioncover', section.sectioncover, 256)
      resizer(imagedir, 'sectioncover', section.sectioncover, 128)
      resizer(imagedir, 'sectioncover', section.sectioncover, 64)
    }
    const views = section.views
    if (!views) {
      console.log(dir + ' does not have views')
      return
    }
    delete section.views
    const sid = (await Section.create(section)).sid

    let cur = 0
    await Promise.all(
      views.map(async (view) => {
        view.sid = sid
        const problems = view.problems
        if (!problems) {
          const errorMsg = { code: 500, message: dir + ' does not have problems' }
          throw errorMsg
        }
        const cnt = problems.length
        view.index_start = cur + 1
        view.index_end = cur + cnt
        if (view.material !== undefined) {
          const imagedir = dir + '/' + view.material
          view.material = uuidv4() + '.png'
          resizer(imagedir, 'material', view.material, 0)
        }
        cur += cnt
        for (let j = 0; j < cnt; j++) {
          const problem = problems[j]
          if (problem.icon_index !== view.index_start + j) {
            const errorMsg = { code: 500, message: 'fuck' }
            throw errorMsg
          }
          problem.sid = sid
          if (problem.content !== undefined) {
            const imagedir = dir + '/' + problem.content
            problem.content = uuidv4() + '.png'
            resizer(imagedir, 'content', problem.content, 0)
          }
          if (problem.explanation !== undefined) {
            const imagedir = dir + '/' + problem.explanation
            problem.explanation = uuidv4() + '.png'
            resizer(imagedir, 'explanation', problem.explanation, 0)
          }
          await Problem.create(problem)
        }
      })
    ).catch(err => { console.log(err) })
    await View.bulkCreate(views)
    /*
    const vids = (await View.bulkCreate(views).catch(e => { console.log(dir + ' is fuck'); throw e })).map(
      (view) => view.dataValues.vid
    )
    */
    console.log(dir)
  }
}

exports.upload = async (req, res) => {
  try {
    const src = path.join(process.env.DATA_SOURCE, req.params.title)
    fs.readdirSync(src).forEach((outer) => {
      fs.readdirSync(path.join(src, '/', outer)).forEach((inner) => {
        if (fs.existsSync(path.join(src, '/', outer, '/', inner, '/config.yaml'))) {
          uploader(path.join(src, '/', outer, '/', inner))
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

/*

      if (
        fs.existsSync(dir + '/config.yaml')
      ) {
        console.log(file)
        uploader(dir)
      }
*/
