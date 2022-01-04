module.exports = (app) => {
  const users = require('../controllers/user.js')

  const router = require('express').Router()

  router.get('/-', users.fetch_self)
  router.put('/:uid', users.update_user)

  app.use('/users', router)
}
