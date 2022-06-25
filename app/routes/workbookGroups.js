const { authJwt } = require('../middleware/auth');
const { workbookGroups } = require('../controllers/workbookGroups.js');

module.exports = (app) => {
  const router = require('express').Router();

  //   router.put('/solve', authJwt, solveWorkbook)
  //   router.get('/purchased', authJwt, getPurchasedWorkbooks)
  //   router.get('/bestseller', getBestsellers)
  //   router.get('/:wid', authJwt, fetchWorkbook)
  router.get('/', workbookGroups);

  app.use('/workbookgroups', router);
};
