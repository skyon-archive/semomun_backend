const router = require('express').Router()
const { getBanners } = require('../controllers/banner')

module.exports = (app) => {
  router.get('/', getBanners)

  app.use('/banners', router)
}
