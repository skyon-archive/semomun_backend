module.exports = (app) => {
  const workbooks = require('../controllers/workbook.js')

  const router = require('express').Router()

  router.get('/:wid', workbooks.fetch_workbook)
  router.get('/', workbooks.fetchWorkbooks)

  app.use('/workbooks', router)
}
