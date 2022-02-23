module.exports = (app) => {
  const s3 = require('../controllers/s3.js')

  const router = require('express').Router()

  router.get('/presignedUrl', s3.get_presignedUrl)

  app.use('/s3', router)
}
