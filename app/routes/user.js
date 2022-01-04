module.exports = (app) => {
  const users = require('../controllers/user.js')

  const router = require('express').Router()

  router.get('/:uid', users.get)

  app.use('/users', router)
}
