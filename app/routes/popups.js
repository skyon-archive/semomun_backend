const router = require('express').Router()
const { getPopup } = require('../controllers/popup')

module.exports = (app) => {
  router.get('/', getPopup)

  app.use('/popups', router)
}
