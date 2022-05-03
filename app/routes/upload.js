const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { readConfig } = require('../controllers/upload')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.post('/config', upload.single('config'), authJwt, readConfig)

  app.use('/upload', router)
}
