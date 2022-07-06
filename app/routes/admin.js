const { adminAuthJwt } = require('../middleware/auth.js');
const {
  getWorkbooks,
  getWorkbookByWid,
  getProblemsByWid,
  getProblemByPid,
} = require('../controllers/admin.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/workbooks', adminAuthJwt, getWorkbooks);
  router.get('/workbooks/:wid', adminAuthJwt, getWorkbookByWid);
  router.get('/workbooks/:wid/problems', adminAuthJwt, getProblemsByWid);
  router.get('/problems/:pid', adminAuthJwt, getProblemByPid);

  app.use('/admin', router);
};
