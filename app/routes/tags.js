module.exports = (app) => {
  const { getTags } = require('../controllers/tags')

  const router = require('express').Router()

  router.get('/', getTags)

  app.use('/tags', router)
}
