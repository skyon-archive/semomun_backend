const { adminAuthJwt } = require('../middleware/auth.js');
const {
  getWorkbooks,
  getWorkbookByWid,
  getProblemsByWid,
  getProblemByPid,
  putWorkbookByWid,
  putProblemByPid,
} = require('../controllers/admin.js');
const { deleteWorkbookByWid } = require('../controllers/admin.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/workbooks', adminAuthJwt, getWorkbooks);
  router.get('/workbooks/:wid', adminAuthJwt, getWorkbookByWid);
  router.get('/workbooks/:wid/problems', adminAuthJwt, getProblemsByWid);
  router.get('/problems/:pid', adminAuthJwt, getProblemByPid);

  router.put('/workbooks/:wid', adminAuthJwt, putWorkbookByWid);
  router.put('/problems/:pid', adminAuthJwt, putProblemByPid);
  router.delete('/workbooks/:wid', adminAuthJwt, deleteWorkbookByWid)

  app.use('/admin', router);
};
