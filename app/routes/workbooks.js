module.exports = (app) => {
  const workbooks = require('../controllers/workbook.js')

  const router = require('express').Router()

  router.get('/', workbooks.fetch_workbooks)

  app.use('/workbooks', router)
}
