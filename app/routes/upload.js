module.exports = (app) => {
  const uploader = require('../controllers/upload.js')

  const router = require('express').Router()

  router.get('/:title', uploader.upload)

  app.use('/upload', router)
}
