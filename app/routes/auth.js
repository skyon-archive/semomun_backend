module.exports = (app) => {
  const auth = require('../controllers/auth')

  const router = require('express').Router()

  router.post('/signup', auth.createUser)
  router.post('/login', auth.login)
  router.get('/refresh', auth.refresh)
  app.use('/auth', router)
}
