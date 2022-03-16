require('dotenv').config()
const { migrateWorkbooks } = require('./app/migrations/migrateWorkbooks')

migrateWorkbooks([30])
