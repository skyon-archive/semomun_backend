const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { readConfig, confirmWorkbook, updateBookcover } = require('../controllers/upload')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.post('/config', upload.single('config'), authJwt, readConfig)
  router.post('/confirm', authJwt, confirmWorkbook)
  router.patch('/bookcover', authJwt, updateBookcover)

  app.use('/upload', router)
}
