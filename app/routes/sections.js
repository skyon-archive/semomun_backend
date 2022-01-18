module.exports = (app) => {
  const sections = require('../controllers/section.js')

  const router = require('express').Router()

  router.get('/:sid', sections.get)
  router.get('/:sid/submission', sections.fetch_submission)
  router.post('/:sid/submission', sections.create_submission)
  router.put('/:sid/submission', sections.update_submission)

  app.use('/sections', router)
}
