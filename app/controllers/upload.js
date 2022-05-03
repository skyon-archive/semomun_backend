const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const { v4: uuidv4 } = require('uuid')
const { Workbooks } = require('../models/index')
const { BadRequest, Forbidden } = require('../errors')
const { getPresignedPost } = require('../services/s3')

const valdiateConfig = (config) => {
  const workbookFields = [
    'title',
    'date',
    'originalPrice',
    'price',
    'detail',
    'bookcover',
    'author',
    'publishCompany',
    'publishMan',
    'continental',
    'country',
    'bigcategory',
    'middlecategory',
    'smallcategory',
    'grade'
  ]
  const workbookIntFields = [
    'price',
    'originalPrice'
  ]
  const sectionFields = [
    'index',
    'title',
    'detail',
    'sectioncover',
    'cutoff'
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
        if (typeof problem.score !== 'number') {
          throw new BadRequest('problem.score 수 아님')
        }
      })
    })
  })

  const workbook = Workbooks.findOne({ title: config.workbook.title })
  if (workbook) throw new BadRequest('title 중복')
}

exports.readConfig = async (req, res) => {
  let filePath
  try {
    filePath = path.join(__dirname, '../../', req.file.path)

    const { role } = req
    if (role !== 'ADMIN') throw new Forbidden('')
    const config = yaml.load(fs.readFileSync(filePath))

    valdiateConfig(config)

    const posts = []
    const bookcoverUuid = uuidv4()
    posts.push({
      post: await getPresignedPost('bookcover', bookcoverUuid),
      filename: config.workbook.bookcover
    })
    config.workbook.bookcover = bookcoverUuid

    await Promise.all(config.sections.map(async (section) => {
      const sectionUuid = uuidv4()
      posts.push({
        post: await getPresignedPost('sectioncover', sectionUuid),
        filename: section.sectioncover
      })
      section.sectioncover = sectionUuid
      await Promise.all(section.views.map(async (view) => {
        if (view.material) {
          const materialUuid = uuidv4()
          posts.push({
            post: await getPresignedPost('passage', materialUuid),
            filename: view.material
          })
          view.material = materialUuid
        }
        await Promise.all(view.problems.map(async (problem) => {
          const contentUuid = uuidv4()
          posts.push({
            post: await getPresignedPost('content', contentUuid),
            filename: problem.content
          })
          problem.content = contentUuid
          if (problem.explanation) {
            const explanationUuid = uuidv4()
            posts.push({
              post: await getPresignedPost('explanation', explanationUuid),
              filename: problem.explanation
            })
            problem.explanation = explanationUuid
          }
        }))
      }))
    }))

    fs.writeFileSync(filePath, JSON.stringify(config))
    res.json({ posts, key: path.basename(filePath) })
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
