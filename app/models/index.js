const env = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.DB_DATABASE, env.DB_USERNAME, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: 100,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    match: [Sequelize.ConnectionError]
  },
  query: { raw: true }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.workbooks = require('./workbook.js')(sequelize, Sequelize)
db.sections = require('./section.js')(sequelize, Sequelize)
db.views = require('./view.js')(sequelize, Sequelize)
db.problems = require('./problem.js')(sequelize, Sequelize)
db.users = require('./user.js')(sequelize, Sequelize)
db.submissions = require('./submission.js')(sequelize, Sequelize)

module.exports = db
