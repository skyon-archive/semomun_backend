const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const { v4: uuidv4 } = require('uuid')
const { BadRequest, Forbidden } = require('../errors')
const { getPresignedPost } = require('../services/s3')

const valdiateConfig = (config) => {
  const workbookFields = [
    'title',
    'date',
    'author',
    'publisher',
    'publishman',
    'isbn',
    'price',
    'orginprice',
    'continental',
    'country',
    'bigcategory',
    'middlecategory',
    'smallsubject',
    'detail',
    'bookcover',
    'grade'
  ]
  const workbookIntFields = [
    'price',
    'orginprice'
  ]
  const sectionFields = [
    'index',
    'title',
    'detail',
    'sectioncover'
  ]
  const problemFields = [
    'icon_index',
    'icon_name',
    'type',
    'content'
  ]
  const problemIntFields = [
    'icon_index',
    'type'
  ]

  workbookFields.forEach((field) => {
    if (!(field in config.workbook)) {
      throw new BadRequest(`workbook.${field} 필드 없음`)
    }
  })
  if (!config.workbook.date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    throw new BadRequest('workbook.date 형식 틀림')
  }
  workbookIntFields.forEach((field) => {
    if (!Number.isInteger(config.workbook[field])) {
      throw new BadRequest(`workbook.${field} 정수 아님`)
    }
  })

  if (!Array.isArray(config.sections)) throw new BadRequest('sections 형식 틀림')
  config.sections.forEach((section) => {
    sectionFields.forEach((field) => {
      if (!(field in section)) {
        throw new BadRequest(`section.${field} 필드 없음`)
      }
    })
    if (!Number.isInteger(section.index)) {
      throw new BadRequest('section.index 정수 아님')
    }
    const views = section.views ?? []
    if (!Array.isArray(views)) throw new BadRequest('views 형식 틀림')
    views.forEach((view) => {
      if (!Number.isInteger(view.form)) throw new BadRequest('view.form 정수 아님')
      const problems = view.problems ?? []
      problems.forEach((problem) => {
        problemFields.forEach((field) => {
          if (!(field in problem)) {
            throw new BadRequest(`problem.${field} 필드 없음`)
          }
        })
        problemIntFields.forEach((field) => {
          if (!Number.isInteger(problem[field])) {
            throw new BadRequest(`problem.${field} 정수 아님`)
          }
        })
        if (problem.score && !Number.isInteger(problem.score)) {
          throw new BadRequest('problem.score 정수 아님')
        }
      })
    })
  })
}

exports.readConfig = async (req, res) => {
  let filePath
  try {
    filePath = path.join(__dirname, '../../', req.file.path)

    const { role } = req
    if (role !== 'ADMIN') throw new Forbidden('')
    const config = yaml.load(fs.readFileSync(filePath))

    valdiateConfig(config)

    const urls = []
    const bookcoverUuid = uuidv4()
    urls.push({
      url: await getPresignedPost('bookcover', bookcoverUuid),
      file: config.workbook.bookcover
    })
    config.workbook.bookcover = bookcoverUuid

    await Promise.all(config.sections.map(async (section) => {
      const sectionUuid = uuidv4()
      urls.push({
        s3: await getPresignedPost('sectioncover', sectionUuid),
        file: section.sectioncover
      })
      section.sectioncover = sectionUuid
      await Promise.all(section.views.map(async (view) => {
        if (view.material) {
          const materialUuid = uuidv4()
          urls.push({
            s3: await getPresignedPost('passage', materialUuid),
            file: view.material
          })
          view.material = materialUuid
        }
        await Promise.all(view.problems.map(async (problem) => {
          const contentUuid = uuidv4()
          urls.push({
            s3: await getPresignedPost('content', contentUuid),
            file: problem.content
          })
          problem.content = contentUuid
          if (problem.explanation) {
            const explanationUuid = uuidv4()
            urls.push({
              s3: await getPresignedPost('explanation', explanationUuid),
              file: problem.explanation
            })
            problem.explanation = explanationUuid
          }
        }))
      }))
    }))

    fs.writeFileSync(filePath, JSON.stringify(config))
    res.json({ urls, key: path.basename(filePath) })
  } catch (err) {
    if (filePath) fs.rmSync(filePath)
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof Forbidden) res.status(403).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
