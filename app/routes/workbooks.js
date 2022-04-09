const { authJwt } = require('../middleware/auth')
const {
  fetchWorkbook,
  fetchWorkbooks,
  solveWorkbook,
  getPurchasedWorkbooks,
  getBestsellers
} = require('../controllers/workbook')

module.exports = (app) => {
  const router = require('express').Router()

  router.put('/solve', authJwt, solveWorkbook)
  router.get('/purchased', authJwt, getPurchasedWorkbooks)
  router.get('/bestseller', getBestsellers)
  router.get('/:wid', authJwt, fetchWorkbook)
  router.get('/', fetchWorkbooks)

  app.use('/workbooks', router)
}
