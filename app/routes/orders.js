module.exports = (app) => {
  const { createOrders } = require('../controllers/orderHistory.js')
  const { authJwt } = require('../middleware/auth')

  const router = require('express').Router()

  router.post('/', authJwt, createOrders)

  app.use('/orders', router)
}
