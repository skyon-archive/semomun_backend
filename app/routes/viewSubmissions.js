const router = require('express').Router()
const { authJwt } = require('../middleware/auth')
const { createViewSubmissions } = require('../controllers/viewSubmissions')

module.exports = (app) => {
  router.post('/', authJwt, createViewSubmissions)

  app.use('/view-submissions', router)
}
