const { authJwt } = require('../middleware/auth')
const {
  fetchWorkbook,
  fetchWorkbooks,
  solveWorkbook,
  getRecentSolveWorkbooks,
  getPurchasedWorkbooks
} = require('../controllers/workbook')

module.exports = (app) => {
  const router = require('express').Router()

  router.put('/solve', authJwt, solveWorkbook)
  router.get('/recent/solve', authJwt, getRecentSolveWorkbooks)
  router.get('/purchased', authJwt, getPurchasedWorkbooks)
  router.get('/:wid', authJwt, fetchWorkbook)
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}
