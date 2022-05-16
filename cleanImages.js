require('dotenv').config()
const { Workbooks, Sections, Views, Problems } = require('./app/models/index')
const { listAllFiles, deleteFile } = require('./app/services/s3')

const clean = (type, findOne) => async () => {
  const files = await listAllFiles(`${type}/`)
  let i = 0
  while (i < files.length) {
    console.log(`${i} / ${files.length}`)
    await Promise.all(files.slice(i, i + 1000).map(async ({ Key: key }) => {
      const uuid = key.slice(type.length + 1, -4)
      const object = await findOne(uuid)
      if (!object) await deleteFile(type, uuid)
    }))
    i += 1000
  }
}

const cleanBookcover = clean(
  'bookcover',
  (uuid) => Workbooks.findOne({ where: { bookcover: uuid } })
)

const cleanContent = clean(
  'content',
  (uuid) => Problems.findOne({ where: { content: uuid } })
)

const cleanExplanation = clean(
  'explanation',
  (uuid) => Problems.findOne({ where: { explanation: uuid } })
)

const cleanPassage = clean(
  'passage',
  (uuid) => Views.findOne({ where: { passage: uuid } })
)

const cleanSectioncover = clean(
  'sectioncover',
  (uuid) => Sections.findOne({ where: { sectioncover: uuid } })
)

cleanBookcover()
  .then(() => cleanContent())
  .then(() => cleanExplanation())
  .then(() => cleanPassage())
  .then(() => cleanSectioncover())
