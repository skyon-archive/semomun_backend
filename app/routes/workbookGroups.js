const router = require('express').Router();
const {
  getWorkbookGroups,
  getOneWorkbookGroup,
  getPurchasedWorkbookGroups,
} = require('../controllers/workbookGroups.js');
const { authJwt } = require('../middleware/auth.js');

module.exports = (app) => {
  router.get('/', getWorkbookGroups);
  router.get('/purchased', authJwt, getPurchasedWorkbookGroups);
  router.get('/:wgid', getOneWorkbookGroup);

  app.use('/workbookgroups', router);
};
