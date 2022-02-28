module.exports = (app) => {
  const { fetchSection, fetchSubmission, createSubmission, updateSubmission } = require('../controllers/section.js')

  const router = require('express').Router()

  router.get('/:sid', fetchSection)
  router.get('/:sid/submission', fetchSubmission)
  router.post('/:sid/submission', createSubmission)
  router.put('/:sid/submission', updateSubmission)

  app.use('/sections', router)
}
