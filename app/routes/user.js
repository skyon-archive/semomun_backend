const router = require('express').Router()
const { authJwt } = require('../middleware/auth')
const { fetchSelf, updateUser } = require('../controllers/user.js')

module.exports = (app) => {
  router.get('/self', authJwt, fetchSelf)
  router.put('/self', authJwt, updateUser)

  app.use('/users', router)
}
