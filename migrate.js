require('dotenv').config()
const { migrateWorkbooks, updateSectionSize, fixTags } = require('./app/migrations/migrateWorkbooks')
// const { migrateUsers } = require('./app/migrations/migrateUsers')
// const { fixSchool } = require('./app/migrations/migrateUsers')

const wids = [2375, 2376, 3600]
migrateWorkbooks(wids).then(() => updateSectionSize(wids)).then(() => fixTags(wids))

// migrateUsers()

// fixSchool()
