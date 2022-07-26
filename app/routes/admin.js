const { adminAuthJwt, consoleAuthJwt } = require('../middleware/auth.js');
const {
  getWorkbooks,
  getWorkbookByWid,
  getProblemsByWid,
  getProblemByPid,
  putWorkbookByWid,
  putProblemByPid,
  signUpConsoleUser,
  loginConsoleUser,
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
  router.delete('/workbooks/:wid', adminAuthJwt, deleteWorkbookByWid);

  router.post('/register', consoleAuthJwt, signUpConsoleUser); // 추후에 인증 미들웨어 필요
  router.post('/login', loginConsoleUser);

  app.use('/admin', router);
};
