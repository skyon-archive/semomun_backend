const router = require('express').Router()
const { getNotices } = require('../controllers/notices')

module.exports = (app) => {
  router.get('/', getNotices)

  app.use('/notices', router)
}
