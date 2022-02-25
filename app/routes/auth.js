module.exports = (app) => {
  const register = require('../controllers/register')
  const auth = require('../controllers/auth')

  const router = require('express').Router()

  router.post('/code/send', register.send_code)
  router.post('/code/verify', register.check_code)
  router.post('/check', register.check)
  router.post('/signup', auth.createUser)
  app.use('/auth', router)
}
