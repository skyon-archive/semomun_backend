module.exports = (app) => {
  const info = require('../controllers/info.js')

  const router = require('express').Router()

  router.get('/category', info.category)

  app.use('/info', router)
}
