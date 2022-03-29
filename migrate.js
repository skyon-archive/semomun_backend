require('dotenv').config()
const { migrateWorkbooks, updateSectionSize } = require('./app/migrations/migrateWorkbooks')

const wids = [169]
migrateWorkbooks(wids).then(() => updateSectionSize(wids))
