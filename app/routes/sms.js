module.exports = (app) => {
  const sms = require('../controllers/sms')

  const router = require('express').Router()

  router.post('/code', sms.sendCode)
  router.post('/code/verify', sms.verifyCode)

  app.use('/sms', router)
}
