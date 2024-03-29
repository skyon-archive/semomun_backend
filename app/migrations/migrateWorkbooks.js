const path = require('path')
const { Items, Workbooks, Sections, Views, Problems, Tags, WorkbookTags } = require('../models/index')
const { s3, readCsv } = require('./utils')

const getFileSize = (key) => {
  return s3.headObject({ Key: key, Bucket: process.env.S3_BUCKET })
    .promise()
    .then(res => res.ContentLength)
    .catch(() => {
      console.log(`Missing ${key}`)
      return 0
    })
}

exports.migrateWorkbooks = async (wids) => {
  try {
    const workbooks = await readCsv(
      path.resolve(__dirname, 'workbooks.csv'),
      (workbook) => wids.includes(+workbook.wid) ? workbook : null
    )
    await Promise.all(workbooks.map(async (workbook) => {
      console.log(`migrating workbook ${workbook.wid}`)
      const dbWorkbook = await Workbooks.findByPk(+workbook.wid)
      if (!dbWorkbook) {
        const item = await Items.create({
          type: 'workbook',
          price: 0,
          sales: +workbook.sales
        })
        await Workbooks.create({
          id: +item.id,
          wid: +workbook.wid,
          title: workbook.title,
          detail: '',
          isbn: '',
          author: '',
          date: `${workbook.year}-${workbook.month.padStart(2, '0')}-01 09:00:00`,
          publishMan: '',
          publishCompany: workbook.publisher,
          originalPrice: 0,
          bookcover: workbook.bookcover.slice(0, 36)
        })
      }
      console.log(`done migrating workbook ${workbook.wid}`)
    }))

    const sections = await readCsv(
      path.resolve(__dirname, 'sections.csv'),
      (section) => wids.includes(+section.wid) ? section : null
    )
    const sids = []
    await Promise.all(sections.map(async (section) => {
      console.log(`migrating section ${section.sid}`)
      const dbSection = await Sections.findByPk(+section.sid)
      if (!dbSection) {
        await Sections.create({
          wid: +section.wid,
          sid: +section.sid,
          index: +section.index,
          title: section.title,
          detail: section.detail,
          cutoff: section.cutoff === 'NULL' ? {} : section.cutoff,
          sectioncover: section.sectioncover.slice(0, 36),
          size: 0
        })
      }
      sids.push(+section.sid)
      console.log(`done migrating section ${section.sid}`)
    }))

    const views = await readCsv(
      path.resolve(__dirname, 'views.csv'),
      (view) => sids.includes(+view.sid) ? view : null
    )
    const viewBySections = {}
    sids.forEach(sid => { viewBySections[sid] = [] })
    views.forEach((view) => { viewBySections[+view.sid].push(view) })
    for (const sid in viewBySections) {
      const viewSection = viewBySections[sid]
      viewSection.sort((v1, v2) => +v1.index_start - +v2.index_start)
    }
    await Promise.all(Object.values(viewBySections).map((viewSection) => {
      return Promise.all(viewSection.map(async (view, idx) => {
        console.log(`migrating view ${view.vid}`)
        const dbView = await Views.findByPk(+view.vid)
        if (!dbView) {
          await Views.create({
            sid: +view.sid,
            vid: +view.vid,
            index: idx + 1,
            form: view.form,
            passage: view.material === 'NULL' ? null : view.material.slice(0, 36)
          })
        }
        console.log(`done migrating view ${view.vid}`)
      }))
    }))

    const problems = await readCsv(
      path.resolve(__dirname, 'problems.csv'),
      (problem) => sids.includes(+problem.sid) ? problem : null
    )
    await Promise.all(problems.map(async (problem) => {
      console.log(`migrating problem ${problem.pid}`)
      const dbProblem = await Problems.findByPk(+problem.pid)
      if (!dbProblem) {
        const view = viewBySections[+problem.sid].find((v) => {
          return +v.index_start <= +problem.icon_index &&
            +problem.icon_index <= +v.index_end
        })
        if (view) {
          await Problems.create({
            vid: +view.vid,
            pid: +problem.pid,
            index: +problem.icon_index - +view.index_start + 1,
            btType: '문',
            btName: problem.icon_name,
            type: +problem.type,
            answer: problem.answer,
            content: problem.content === 'NULL'
              ? null
              : problem.content.slice(0, 36),
            explanation: problem.explanation === 'NULL'
              ? null
              : problem.explanation.slice(0, 36),
            score: +problem.score
          })
        }
      }
      console.log(`done migrating problem ${problem.pid}`)
    }))
  } catch (e) {
    console.log(e)
  }
}

exports.updateSectionSize = async (wids) => {
  const sections = await Sections.findAll({
    where: { wid: wids },
    include: {
      association: 'views',
      include: 'problems'
    }
  })
  await Promise.all(sections.map(async (section) => {
    console.log(`updating section ${section.sid}`)
    const sizes = await Promise.all(section.views.map(async (view) => {
      let size = 0
      if (view.passage) size += await getFileSize(`passage/${view.passage}.png`)
      if (view.attachment) size += await getFileSize(`attachment/${view.attachment}.mp3`)
      const sizes = await Promise.all(view.problems.map(async (problem) => {
        let size = 0
        if (problem.content) size += await getFileSize(`content/${problem.content}.png`)
        if (problem.explanation) size += await getFileSize(`explanation/${problem.explanation}.png`)
        return size
      }))
      return sizes.reduce((previous, current) => previous + current, size)
    }))
    const size = sizes.reduce((previous, current) => previous + current, 0)
    if (size !== section.size) await section.update({ size })
    console.log(`done updating section ${section.sid}`)
  }))
}

exports.fixTags = async (wids) => {
  try {
    const workbooks = await readCsv(
      path.resolve(__dirname, 'workbooks.csv'),
      (workbook) => workbook
    )
    const cnt = workbooks.length
    for (let i = 0; i < cnt; i += 1) {
      const workbook = workbooks[i]
      if (!wids.includes(+workbook.wid)) continue
      console.log(`wid = ${workbook.wid}`)
      const newTags = [workbook.category, workbook.subject, workbook.grade]
      const dbTags = (await WorkbookTags.findAll({
        where: { wid: workbook.wid },
        include: 'tid_Tag'
      })).map((workbookTag) => workbookTag.tid_Tag.name)
      await Promise.all(newTags.map(async (newTag) => {
        if (!dbTags.includes(newTag)) {
          const tags = await Tags.findAll({ where: { name: newTag }, raw: true })
          const tag = tags.length === 0
            ? (await Tags.create({ name: newTag }))
            : tags[0]
          await WorkbookTags.create({
            wid: +workbook.wid, tid: tag.tid
          })
        }
      }))
    }
  } catch (err) {
    console.log(err)
  }
}
