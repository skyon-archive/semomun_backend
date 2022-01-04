module.exports = (app) => {
  const info = require('../controllers/info.js')

  const router = require('express').Router()

  router.get('/buttons', info.buttons)
  router.get('/category', info.category)
  router.get('/major', info.major)

  app.use('/info', router)
}
