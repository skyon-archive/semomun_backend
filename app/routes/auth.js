module.exports = (app) => {
  const register = require('../controllers/register')
  const auth = require('../controllers/auth')

  const router = require('express').Router()

  router.post('/signup', auth.createUser)
  router.post('/login', auth.login)
  router.get('/refresh', auth.refresh)
  router.post('/code/send', register.send_code)
  router.post('/code/verify', register.check_code)
  app.use('/auth', router)
}
