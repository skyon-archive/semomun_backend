const {
  createUserBillingKey,
  getUserBillingKeysByUid,
  deleteUserBillingKey,
  bootPayWebhook,
  createSemopayOrder,
  getSemopayOrders,
  getSemopay,
} = require('../controllers/semopay.js');

module.exports = (app) => {
  const { authJwt } = require('../middleware/auth');

  const router = require('express').Router();

  //Card
  router.post('/billing-keys', authJwt, createUserBillingKey);
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);
  router.delete('/billing-keys/:bkid', authJwt, deleteUserBillingKey);

  // Payment
  router.post('/orders', authJwt, createSemopayOrder);
  router.get('/orders', authJwt, getSemopayOrders);
  router.get('/', authJwt, getSemopay)
  router.post('/webhook', bootPayWebhook);

  app.use('/semopay', router);
};
