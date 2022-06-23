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
    username: env.LOCAL_USERNAME,
    password: env.LOCAL_PASSWORD,
    database: env.LOCAL_DATABASE,
    host: env.LOCAL_HOST,
    dialect: env.LOCAL_DIALECT,
  },
  product: {
    username: env.PRODUCT_USERNAME,
    password: env.PRODUCT_PASSWORD,
    database: env.PRODUCT_DATABASE,
    host: env.PRODUCT_HOST,
    dialect: env.PRODUCT_DIALECT,
  },
};
