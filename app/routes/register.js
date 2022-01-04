module.exports = (app) => {
  const register = require('../controllers/register.js')

  const router = require('express').Router()

  router.post('/auth', register.send_code)
  router.post('/verify', register.check_code)
  router.post('/', register.create_user)
  router.post('/check', register.check)
  app.use('/register', router)
}
