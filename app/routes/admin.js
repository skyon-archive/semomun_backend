const { adminAuthJwt } = require('../middleware/auth.js');
const { getWorkbooks } = require('../controllers/admin.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/workbooks', adminAuthJwt, getWorkbooks);

  app.use('/admin', router);
};
