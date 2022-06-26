const router = require('express').Router();
const { getWorkbookGroups, getOneWorkbookGroup } = require('../controllers/workbookGroups.js');
const { authJwt } = require('../middleware/auth.js');

module.exports = (app) => {
  router.get('/', getWorkbookGroups);
  // router.get('/:wgid', authJwt, getOneWorkbookGroup);
  router.get('/:wgid', getOneWorkbookGroup);

  app.use('/workbookgroups', router);
};
