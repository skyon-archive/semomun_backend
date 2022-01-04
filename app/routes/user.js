module.exports = (app) => {
  const users = require('../controllers/user.js')

  const router = require('express').Router()

  router.get('/:uid', users.fetch_user)
  router.put('/:uid', users.update_user)

  app.use('/users', router)
}
