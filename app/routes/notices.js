const router = require('express').Router()
const { getNotices } = require('../controllers/notice')

module.exports = (app) => {
  router.get('/', getNotices)

  app.use('/notices', router)
}
