const { createUserBillingKeys, getUserBillingKeysByUid } = require('../controllers/semopay');

module.exports = (app) => {
  const { authJwt } = require('../middleware/auth');

  const router = require('express').Router();

  router.post('/billing-keys', authJwt, createUserBillingKeys);
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);

  app.use('/semopay', router);
};
