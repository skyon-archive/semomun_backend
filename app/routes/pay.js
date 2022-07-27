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

  /**
   * @swagger
   * paths:
   *  /pay/billing-keys:
   *    get:
   *      summary: "카드(빌링키) 전체 목록 조회"
   *      description: "자동결제에 등록된 카드의 전체 목록을 가져옵니다(삭제된 카드 제외)"
   *      tags: [Bootpay Card]
   *      responses:
   *        200:
   *          description: 성공시, 등록된 카드 정보가 리턴됩니다.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  billing_keys1:
   *                    type: array
   *                    items:
   *                      type: object
   *                      $ref: '#/components/schemas/billingKeyDTO'
   *
   */
  router.get('/billing-keys', authJwt, getUserBillingKeysByUid);
  /**
   * @swagger
   * paths:
   *  /pay/billing-keys:
   *    post:
   *      summary: "카드(빌링키) 등록"
   *      description: "자동결제에 등록할 카드를 추가합니다.\n\n**부트페이 UI에서 카드를 등록하면**, receipt_id를 받게 됩니다.\n\n해당 `receipt_id`를 그래도 넘겨주시면 됩니다."
   *      tags: [Bootpay Card]
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                receipt_id:
   *                  type: string
   *              required:
   *                - receipt_id
   *      responses:
   *        204:
   *          description: 성공
   *        400:
   *          description: 실패
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: object
   *                    $ref: '#/components/schemas/RC_NOT_FOUND'
   *        401:
   *          description: 인증 오류
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   */
  router.post('/billing-keys', authJwt, createUserBillingKey);
  /**
   * @swagger
   * paths:
   *  /pay/billing-keys/{bkid}:
   *    delete:
   *      summary: "카드(빌링키) 전체 목록 조회 API"
   *      description: "자동결제에 등록된 카드의 전체 목록을 가져옵니다(삭제된 카드 제외)"
   *      tags: [Bootpay Card]
   *      parameters:
   *        - in: path
   *          name: bkid
   *          type: integer
   *          required: true
   *          description: 등록된 카드(빌링키)의 **고유 PK인** `bkid`.
   *      responses:
   *        204:
   *          description: 성공
   *        401:
   *          description: 인증 오류시 `Invalid Token.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   *        403:
   *          description: 삭제된 유저면 `Already deleted User.` 삭제된 카드면 `Already deleted Info.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Forbidden'
   *        404:
   *          description: 찾을 수 없는 유저면 `User does not exist.` 해당 bkid로 조회한 빌링키 정보가 없을 경우 `Invalid Bk Info.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/NotFound'
   */
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
