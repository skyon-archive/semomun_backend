require('dotenv').config()
const env = process.env

module.exports = {
  development: {
    username: env.DEVELOPMENT_USERNAME,
    password: env.DEVELOPMENT_PASSWORD,
    database: env.DEVELOPMENT_DATABASE,
    host: env.DEVELOPMENT_HOST,
    dialect: env.DEVELOPMENT_DIALECT,
  },
  test: {
    username: env.TEST_USERNAME,
    password: env.TEST_PASSWORD,
    database: env.TEST_DATABASE,
    host: env.TEST_HOST,
    dialect: env.TEST_DIALECT,
  },
  product: {
    username: env.PRODUCT_USERNAME,
    password: env.PRODUCT_PASSWORD,
    database: env.PRODUCT_DATABASE,
    host: env.PRODUCT_HOST,
    dialect: env.PRODUCT_DIALECT,
  },
};
