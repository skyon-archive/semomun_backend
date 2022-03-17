require('dotenv').config()
const { updateSectionSize } = require('./app/migrations/migrateWorkbooks')
updateSectionSize([30])

// const { migrateWorkbooks } = require('./app/migrations/migrateWorkbooks')
// migrateWorkbooks([30])
