const router = require('express').Router()
const { getTags, getMyTags } = require('../controllers/tags')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.get('/', getTags)
  router.get('/self', authJwt, getMyTags)

  app.use('/tags', router)
}
