require('dotenv').config()
// const { migrateWorkbooks, updateSectionSize } = require('./app/migrations/migrateWorkbooks')
// const { migrateUsers } = require('./app/migrations/migrateUsers')
const { fixSchool } = require('./app/migrations/migrateUsers')

// const wids = [169]
// migrateWorkbooks(wids).then(() => updateSectionSize(wids))

// migrateUsers()

fixSchool()
