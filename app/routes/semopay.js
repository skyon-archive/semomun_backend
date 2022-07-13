const {
  createUserBillingKey,
  getUserBillingKeysByUid,
  deleteUserBillingKey,
} = require('../controllers/semopay');

module.exports = (app) => {
  const { authJwt } = require('../middleware/auth');

  const router = require('express').Router();

  router.post('/billing-keys', authJwt, createUserBillingKey);
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);
  router.delete('/billing-keys/:bkid', authJwt, deleteUserBillingKey);

  app.use('/semopay', router);
};
