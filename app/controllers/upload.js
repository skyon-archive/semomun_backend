const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const { v4: uuidv4 } = require('uuid')
const { sequelize, Items, Workbooks, Sections, Views, Problems, Tags, WorkbookTags } = require('../models/index')
const { BadRequest, Forbidden } = require('../errors')
const { getPresignedPost, checkFileExist } = require('../services/s3')

const valdiateConfig = async (config) => {
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

  const workbook = await Workbooks.findOne({
    where: { title: config.workbook.title }
  })
  if (workbook) throw new BadRequest(`title 중복: ${workbook.title}`)
}

exports.readConfig = async (req, res) => {
  let filePath
  try {
    filePath = path.join(__dirname, '../../', req.file.path)

    const { role } = req
    if (role !== 'ADMIN') throw new Forbidden('')
    const config = yaml.load(fs.readFileSync(filePath))

    await valdiateConfig(config)

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

exports.confirmWorkbook = async (req, res) => {
  try {
    const { key } = req.body
    const { role } = req
    if (role !== 'ADMIN') throw new Forbidden('')

    const filePath = path.join(__dirname, '../../uploads', key)
    if (!fs.existsSync(filePath)) {
      throw new BadRequest(`옳지 않은 key ${key}`)
    }
    const { workbook, sections } = JSON.parse(fs.readFileSync(filePath))

    await checkFileExist('bookcover', workbook.bookcover)
    await Promise.all(sections.map(async (section) => {
      await checkFileExist('sectioncover', section.sectioncover)
      section.views.map(async (view) => {
        if (view.material) await checkFileExist('passage', view.material)
        await Promise.all(view.problems.map(async (problem) => {
          await checkFileExist('content', problem.content)
          if (problem.explanation) await checkFileExist('explanation', problem.explanation)
        }))
      })
    }))

    const dbItem = await Items.create({
      type: 'workbook',
      sales: 0,
      price: workbook.price
    })

    const m = workbook.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    const dbWorkbook = await Workbooks.create({
      id: dbItem.id,
      title: workbook.title,
      detail: workbook.detail,
      isbn: workbook.isbn ?? '',
      author: workbook.author,
      date: `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')} 09:00:00`,
      publishMan: workbook.publishMan,
      publishCompany: workbook.publishCompany,
      originalPrice: workbook.originalPrice,
      bookcover: workbook.originalPrice
    })

    const tagNames = [
      workbook.continental,
      workbook.country,
      workbook.bigcategory,
      workbook.middlecategory,
      workbook.smallcategory,
      workbook.grade
    ]
    let dbTags
    await sequelize.transaction(async (transaction) => {
      const oldDbTags = await Tags.findAll({
        where: { name: tagNames },
        transaction
      })
      const dbTagNames = oldDbTags.map((tag) => tag.name)
      const missingTags = tagNames.filter((tag) => dbTagNames.includes(tag))
      const newDbTags = await Tags.bulkCreate(
        missingTags.map((name) => ({ name })),
        { transaction }
      )
      dbTags = oldDbTags.concat(newDbTags)
    })
    await WorkbookTags.bulkCreate(
      dbTags.map(({ tid }) => ({ tid, wid: dbWorkbook.wid }))
    )

    await Promise.all(sections.map(async ({ views, cutoff, ...section }) => {
      const dbSection = await Sections.create({
        wid: dbWorkbook.wid,
        size: 0,
        cutoff: cutoff ?? {},
        ...section
      })
      await Promise.all(views.map(async ({ problems, ...view }, idx) => {
        const dbView = await Views.create({
          sid: dbSection.sid,
          index: idx + 1,
          ...view
        })
        problems.sort((a, b) => a.icon_index < b.icon_index)
        await Problems.bulkCreate(problems.map((problem, idx) => ({
          vid: dbView.vid,
          index: idx + 1,
          btType: '', /* TODO */
          btName: problem.icon_name,
          type: problem.type,
          answer: problem.answer,
          content: problem.content,
          explanation: problem.explanation,
          score: problem.score
        })))
      }))
    }))

    if (filePath) fs.rmSync(filePath)
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof Forbidden) res.status(403).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
