module.exports = (app) => {
  const { authJwt } = require('../middleware/auth')
  const {
    fetchWorkbook,
    fetchWorkbooks,
    startWorkbook,
    getRecentSolveWorkbooks
  } = require('../controllers/workbook')

  const router = require('express').Router()

  router.get('/:wid', authJwt, fetchWorkbook)
  router.put('/start', authJwt, startWorkbook)
  router.get('/recent/solve', authJwt, getRecentSolveWorkbooks)
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}
