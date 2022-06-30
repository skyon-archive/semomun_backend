const { authJwt } = require('../middleware/auth.js');
const {
  postScoredData,
  getAllResultByWgid,
  getOneResultByWid,
} = require('../controllers/result.js');
const router = require('express').Router();

module.exports = (app) => {
  router.post('/scoring', authJwt, postScoredData);
  router.get('/workbooks/:wid', authJwt, getOneResultByWid);
  router.get('/workbookgroups/:wgid', authJwt, getAllResultByWgid);

  app.use('/result', router);
};
