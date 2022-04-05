const router = require('express').Router()
const { authJwt } = require('../middleware/auth')
const { createSubmissions } = require('../controllers/submissions')

module.exports = (app) => {
  router.post('/', authJwt, createSubmissions)

  app.use('/submissions', router)
}
