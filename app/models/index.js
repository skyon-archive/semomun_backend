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
  define: { timestamps: true }
})

const db = require('./init-models')(sequelize)
sequelize.sync()

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db
