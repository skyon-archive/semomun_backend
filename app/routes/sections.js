module.exports = (app) => {
  const sections = require('../controllers/section.js')

  const router = require('express').Router()

  router.get('/:sid', sections.get)

  app.use('/sections', router)
}
