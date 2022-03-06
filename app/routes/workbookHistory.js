
const router = require('express').Router()
const { authJwt } = require('../middleware/auth')
const { startWorkbook } = require('../controllers/workbookHistory')

module.exports = (app) => {
  router.put('/start', authJwt, startWorkbook)

  app.use('/workbook-history', router)
}
