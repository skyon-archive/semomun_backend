const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.workbooks = require("./workbook.js")(sequelize, Sequelize);
db.sections = require("./section.js")(sequelize, Sequelize);
db.views = require("./view.js")(sequelize, Sequelize);
db.problems = require("./problem.js")(sequelize, Sequelize);

module.exports = db;
