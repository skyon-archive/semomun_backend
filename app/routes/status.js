const router = require('express').Router()
const { checkIsReview } = require('../controllers/status')

module.exports = (app) => {
  router.get('/review', checkIsReview)

  app.use('/status', router)
}
