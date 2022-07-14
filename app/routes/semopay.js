const { createSemopayOrder } = require('../controllers/semopay');
const {
  createUserBillingKey,
  getUserBillingKeysByUid,
  deleteUserBillingKey,
  bootPayWebhook,
} = require('../controllers/semopay');

module.exports = (app) => {
  const { authJwt } = require('../middleware/auth');

  const router = require('express').Router();

  //Card
  router.post('/billing-keys', authJwt, createUserBillingKey);
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);
  router.delete('/billing-keys/:bkid', authJwt, deleteUserBillingKey);

  // Payment
  router.post('/', authJwt, createSemopayOrder)
  router.post('/webhook', bootPayWebhook);

  app.use('/semopay', router);
};
