const { getCategories } = require('../controllers/categories');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/');

  app.use('/categories', getCategories);
};
