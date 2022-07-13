const { createUserBillingKeys } = require('../controllers/semopay');

module.exports = (app) => {
  const { authJwt } = require('../middleware/auth');

  const router = require('express').Router();

  router.post('/billing-keys', authJwt, createUserBillingKeys);

  app.use('/semopay', router);
};
