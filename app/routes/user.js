module.exports = (app) => {
  const users = require('../controllers/user.js')

  const router = require('express').Router()

  router.get('/self', users.fetch_self)
  router.put('/:nickname', users.update_user)

  app.use('/users', router)
}
