const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { readConfig, confirmWorkbook } = require('../controllers/upload')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.post('/config', upload.single('config'), authJwt, readConfig)
  router.post('/confirm', authJwt, confirmWorkbook)

  app.use('/upload', router)
}
