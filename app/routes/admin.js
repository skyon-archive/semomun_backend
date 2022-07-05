const { adminAuthJwt } = require('../middleware/auth.js');
const { getWorkbooks, getWorkbookByWid } = require('../controllers/admin.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/workbooks', adminAuthJwt, getWorkbooks);
  router.get('/workbooks/:wid', adminAuthJwt, getWorkbookByWid);

  app.use('/admin', router);
};
