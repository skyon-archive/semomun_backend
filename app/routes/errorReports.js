const router = require('express').Router()
const { createErrorReport } = require('../controllers/errorReport')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.post('/', authJwt, createErrorReport)

  app.use('/error-reports', router)
}
