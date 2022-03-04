module.exports = (app) => {
  const { createOrders, getOrderHistory } = require('../controllers/orderHistory.js')
  const { authJwt } = require('../middleware/auth')

  const router = require('express').Router()

  router.post('/', authJwt, createOrders)
  router.get('/', authJwt, getOrderHistory)

  app.use('/orders', router)
}
