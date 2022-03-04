module.exports = (app) => {
  const { createOrders, getPaymentHistory } = require('../controllers/pay')
  const { authJwt } = require('../middleware/auth')

  const router = require('express').Router()

  router.post('/orders', authJwt, createOrders)
  router.get('/', authJwt, getPaymentHistory)

  app.use('/pay', router)
}
