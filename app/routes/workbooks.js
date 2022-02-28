module.exports = (app) => {
  const { authJwt } = require('../middleware/auth')
  const { fetchWorkbook, fetchWorkbooks } = require('../controllers/workbook')

  const router = require('express').Router()

  router.get('/:wid', authJwt, fetchWorkbook)
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}
