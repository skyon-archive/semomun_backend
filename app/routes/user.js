const router = require('express').Router()
const { authJwt } = require('../middleware/auth')
const { fetchSelf, updateUser, existByUsername, migrate, withdraw } = require('../controllers/user.js')

module.exports = (app) => {
  router.get('/self', authJwt, fetchSelf)
  router.put('/self', authJwt, updateUser)
  router.get('/username', existByUsername)
  router.post('/migrate', migrate)
  router.delete('/self', authJwt, withdraw)

  app.use('/users', router)
}
