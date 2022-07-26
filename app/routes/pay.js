module.exports = (app) => {
  const { createOrders, getPayHistory } = require('../controllers/pay.js');
  const {
    createUserBillingKey,
    getUserBillingKeysByUid,
    deleteUserBillingKey,
    bootPayWebhook,
    createBootpayOrders,
    getBootpayOrders,
    getSemopay,
    getAutoChargeInfo,
    putAutoChargeInfo,
  } = require('../controllers/bootpay.js');
  const { authJwt } = require('../middleware/auth.js');

  const router = require('express').Router();

  // ----- pay -----
  router.post('/orders', authJwt, createOrders);
  router.get('/', authJwt, getPayHistory);

  // ----- semopay -----
  //Card
  router.post('/billing-keys', authJwt, createUserBillingKey);
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);
  router.delete('/billing-keys/:bkid', authJwt, deleteUserBillingKey);

  // Payment
  router.post('/bootpay-orders', authJwt, createBootpayOrders);
  router.get('/bootpay-orders', authJwt, getBootpayOrders);
  router.get('/info', authJwt, getSemopay);
  router.post('/webhook', bootPayWebhook);

  // AutoCharge
  router.get('/auto-charge', authJwt, getAutoChargeInfo);
  router.put('/auto-charge', authJwt, putAutoChargeInfo);

  app.use('/pay', router);
};
