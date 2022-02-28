module.exports = (app) => {
  const { authJwt } = require('../middleware/auth')
  const users = require('../controllers/user.js')

  const router = require('express').Router()

  router.get('/self', users.fetch_self)
  router.put('/self', authJwt, users.updateUser)

  app.use('/users', router)
}
