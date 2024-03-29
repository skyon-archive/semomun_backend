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
  define: { timestamps: true },
  timezone: '+09:00'
})

const db = require('./init-models')(sequelize)
// sequelize.sync() // WorkbookGroups생성을 위한 싱크 함수 실행.

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db
