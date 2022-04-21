module.exports = (app) => {
  const { getPresignedUrl } = require('../controllers/s3')
  const { authJwt } = require('../middleware/auth')

  const router = require('express').Router()

  router.get('/presignedUrl', authJwt, getPresignedUrl)

  app.use('/s3', router)
}
