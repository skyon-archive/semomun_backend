require('dotenv').config()
const { Workbooks, Sections, Views, Problems } = require('./app/models/index')
const { listAllFiles, deleteFile } = require('./app/services/s3')

const cleanBookcover = async () => {
  const files = (await listAllFiles('bookcover/'))
  await Promise.all(files.map(async ({ Key: key }) => {
    const uuid = key.slice(10, -4)
    const workbook = await Workbooks.findOne({ where: { bookcover: uuid } })
    if (!workbook) await deleteFile('bookcover', uuid)
  }))
}

const cleanContent = async () => {
  const files = (await listAllFiles('content/'))
  await Promise.all(files.map(async ({ Key: key }) => {
    const uuid = key.slice(8, -4)
    const problem = await Problems.findOne({ where: { content: uuid } })
    if (!problem) await deleteFile('content', uuid)
  }))
}

const cleanExplanation = async () => {
  const files = (await listAllFiles('explanation/'))
  await Promise.all(files.map(async ({ Key: key }) => {
    const uuid = key.slice(12, -4)
    const problem = await Problems.findOne({ where: { explanation: uuid } })
    if (!problem) await deleteFile('explanation', uuid)
  }))
}

const cleanPassage = async () => {
  const files = (await listAllFiles('passage/'))
  await Promise.all(files.map(async ({ Key: key }) => {
    const uuid = key.slice(8, -4)
    const view = await Views.findOne({ where: { passage: uuid } })
    if (!view) await deleteFile('passage', uuid)
  }))
}

const cleanSectioncover = async () => {
  const files = (await listAllFiles('sectioncover/'))
  await Promise.all(files.map(async ({ Key: key }) => {
    const uuid = key.slice(13, -4)
    const section = await Sections.findOne({ where: { sectioncover: uuid } })
    if (!section) await deleteFile('sectioncover', uuid)
  }))
}

cleanBookcover()
  .then(() => cleanContent())
  .then(() => cleanExplanation())
  .then(() => cleanPassage())
  .then(() => cleanSectioncover())
