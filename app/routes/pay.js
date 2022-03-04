module.exports = (app) => {
  const { createOrders, getPayHistory } = require('../controllers/pay')
  const { authJwt } = require('../middleware/auth')

  const router = require('express').Router()

  router.post('/orders', authJwt, createOrders)
  router.get('/', authJwt, getPayHistory)

  app.use('/pay', router)
}
