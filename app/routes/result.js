const { authJwt } = require('../middleware/auth.js');
const { postScoredData, getAllResultByWgid } = require('../controllers/result.js');
const router = require('express').Router();

module.exports = (app) => {
  router.post('/scoring', authJwt, postScoredData);
  router.get('/workbooks/:wid', authJwt);
  router.get('/workbookgroups/:wgid', authJwt, getAllResultByWgid);

  app.use('/result', router);
};
