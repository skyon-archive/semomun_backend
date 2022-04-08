const router = require('express').Router()
const { getTags, getMyTags, updateMyTags } = require('../controllers/tags')
const { authJwt } = require('../middleware/auth')

module.exports = (app) => {
  router.get('/', getTags)
  router.get('/self', authJwt, getMyTags)
  router.put('/self', authJwt, updateMyTags)

  app.use('/tags', router)
}
