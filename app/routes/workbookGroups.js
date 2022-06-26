const router = require('express').Router();
const { getWorkbookGroups } = require('../controllers/workbookGroups.js');

module.exports = (app) => {
  router.get('/', getWorkbookGroups);

  app.use('/workbookgroups', router);
};
