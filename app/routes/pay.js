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
   *                  billing_keys:
   *                    type: array
   *                    items:
   *                      type: object
   *                      $ref: '#/components/schemas/BillingKeyResDTO'
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
   *      summary: 카드(빌링키) 삭제
   *      description: 선택된 `{bkid}`의 카드 정보를 삭제합니다.
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
  
  /**
   * @swagger
   * paths:
   *  /pay/bootpay-orders:
   *    get:
   *      summary: 세모페이 결제/사용 내역 조회
   *      description: "1. **사용자가 충전 또는 사용한 내역을 볼 수 있는 API입니다.**\n\n2. **수동 결제여도 카드가 등록되어 있어야 합니다.**\n\n3. **최근 6개월 까지의 내역만 조회 가능합니다.**"
   *      tags: [Payment]
   *      parameters:
   *        - in: query
   *          name: type
   *          schema:
   *            type: string
   *            default: "all"
   *          description: "- `all` : 전체 내역 조회\n\n- `charge` : 충전 내역 조회\n\n- `order` : 사용 내역 조회"
   *          
   *      responses:
   *        200:
   *          description: 성공
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  semopayHistories:
   *                    type: array
   *                    items:
   *                      type: object
   *                      $ref: '#/components/schemas/SemopayHistoryResDTO'
   *        401:
   *          description: "인증 오류 일 때 `Invalid Token.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   *        403:
   *          description: "삭제된 유저 일 때 `Already deleted User.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Forbidden'
   *        404:
   *          description: "없는 유저 일 때 `User does not exist.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/NotFound'
   */
  router.get('/bootpay-orders', authJwt, getBootpayOrders);
  /**
   * @swagger
   * paths:
   *  /pay/bootpay-orders:
   *    post:
   *      summary: 수동 결제
   *      description: "수동으로 사용자가 금액을 입력하여 결제할 수 있는 API 입니다\n\n수동 결제여도 카드가 등록되어 있어야 합니다.\n\n현재는 해당 API에 대하여 프론트에서 `order_name`의 값을 하드하게 `세모페이 수동 충전` 으로 주고 있습니다."
   *      tags: [Payment]
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/components/schemas/ManualPaymentReqDTO'
   *      responses:
   *        201:
   *          description: 성공
   *        400:
   *          description: "- **bkid**가 주어지지 않았을 때 : `bkid was not given.`\n\n- **order_name**의 값이 **세모페이 수동 충전**이 아닐 떄 `Invalid order name.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/BadRequest'
   *        401:
   *          description: "인증 오류 일 때 `Invalid Token.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   *        403:
   *          description: "삭제된 유저 일 때 `Already deleted User.`\n\n삭제된 카드(등록한) 일 때 `Already deleted Info.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Forbidden'
   *        404:
   *          description: "없는 유저 일 때 `User does not exist.`\n\n없는 카드 정보 일 때 `Invalid Bk Info.`"
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/NotFound'
   */
  router.post('/bootpay-orders', authJwt, createBootpayOrders);
  router.get('/info', authJwt, getSemopay);
  router.post('/webhook', bootPayWebhook);

  /**
   * @swagger
   * paths:
   *  /pay/auto-charge:
   *    get:
   *      summary: 자동충전 정보 조회
   *      description: 자동충전 유무 및 설정값에 대한 정보를 가져옵니다.
   *      tags: [Auto Charge]
   *      responses:
   *        200:
   *          description: 성공
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/AutoChargeResDTO'
   *        401:
   *          description: 인증 실패시 `Invalid Token.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   *        403:
   *          description: 삭제된 유저일 때 `Already deleted User.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Forbidden'
   *        404:
   *          description: 없는 유저일 때 `User does not exist.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/NotFound'
   */
  router.get('/auto-charge', authJwt, getAutoChargeInfo);
  /**
   * @swagger
   * paths:
   *  /pay/auto-charge:
   *    put:
   *      summary: 자동충전 정보 수정
   *      description: 자동충전 유무 및 설정값에 대한 정보를 수정합니다.
   *      tags: [Auto Charge]
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/components/schemas/AutoChargePutDTO'
   *      responses:
   *        204:
   *          description: 성공
   *        401:
   *          description: 인증 실패시 `Invalid Token.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/UnAuthorized'
   *        403:
   *          description: 삭제된 유저일 때 `Already deleted User.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/Forbidden'
   *        404:
   *          description: 없는 유저일 때 `User does not exist.`
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                $ref: '#/components/schemas/NotFound'
   */
  router.put('/auto-charge', authJwt, putAutoChargeInfo);

  app.use('/pay', router);
};
