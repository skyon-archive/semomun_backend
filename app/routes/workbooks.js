module.exports = (app) => {
  const { authJwt } = require('../middleware/auth')
  const { fetchWorkbook, fetchWorkbooks, startWorkbook } = require('../controllers/workbook')

  const router = require('express').Router()

  router.get('/:wid', authJwt, fetchWorkbook)
  router.put('/start', authJwt, startWorkbook)
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}
