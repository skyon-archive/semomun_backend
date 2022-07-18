const { BadRequest, NotFound } = require('../errors');
const { Op } = require('sequelize');
const { parseIntDefault } = require('../utils');
const { createOrders, getPayHistory } = require('../services/payHistory');
const { selectUsersByUid } = require('../services/semopay');
const { Bootpay } = require('@bootpay/backend-js');
const { SemopayOrder, PayHistory, UserBillingKeys } = require('../models/index.js');
const { MAX_CHARGE_SEMOPAY } = require('../../server.js');

exports.createOrders = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);

    const { ids } = req.body;
    if (!Array.isArray(ids)) throw new BadRequest('WRONG_BODY');

    let balance = await createOrders(uid, ids);

    // 여기까지 왔다면, 성공적으로 구매도 된 것.
    // 자동 충전 관련 로직만 들어가면 됨.
    const userInfo = await selectUsersByUid(uid);
    if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
    if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });
    if (userInfo.isAutoCharged && userInfo.lessThenAmount >= balance) {
      // 자동 충전이 완료고, 남은 금액이 설정값보다 작다면,

      const bkInfo = await UserBillingKeys.findOne({
        where: { uid, deletedAt: { [Op.is]: null }, isAutoCharged: true },
      });

      const price = userInfo.chargeAmount;
      const order_name = '세모페이 자동 충전';
      const billing_key = bkInfo.billing_key;
      const bkid = bkInfo.bkid;

      // 소지 가능한 금액 한도 초과시
      if (price + balance > MAX_CHARGE_SEMOPAY || price > MAX_CHARGE_SEMOPAY) {
        userInfo.isAutoCharged = false;
        userInfo.save();
        return res.status(403).json({ message: 'The chargeable amount has been exceeded.' });
      }

      Bootpay.setConfiguration({
        application_id: process.env.BOOTPAY_APPLICATION_ID,
        private_key: process.env.BOOTPAY_PRIVATE_KEY,
      });
      await Bootpay.getAccessToken();

      const payResult = await Bootpay.requestSubscribeCardPayment({
        billing_key,
        order_name,
        price,
        card_quota: '00', // 00 = 일시불
        order_id: new Date().getTime(),
        user: { username: String(uid) },
      });
      /**
       * 이 순간에는 구매가 완료가 되어야 함,
       * 그런데 카드 문제, 카드 잔액 부족, 분실 카드, 카드사 점검 등 수 많은 이유 등으로 결제가 안될 수 있음.
       * 그러면 BootPay에서 그걸 감지하고 catch로 err를 리턴해줌
       *
       * 따라서 부트페이와 관련된 에러가 응답되면,
       * 기본적인 구매는 잘 되었다고 판단하면 될듯..?
       */

      payResult.uid = uid;
      payResult.bkid = bkid;
      const soInfo = await SemopayOrder.create(payResult);
      // console.log('This is SemopayOrder Instance =', soInfo);
      balance += price;
      const soid = soInfo.soid;
      await PayHistory.create({
        uid,
        soid,
        amount: price,
        balance,
        type: 'autoCharge',
      });
    }

    res.json({ balance }).send();
  } catch (err) {
    // 이 부분에 대해서 IOS와 얘기를 해봐야 할 듯 함.
    if (err instanceof BadRequest) res.status(400).send(err.message);
    else if (err instanceof NotFound) res.status(404).send(err.message);
    else {
      console.log(err);
      res.status(500).send();
      // if (err instanceof BadRequest) res.status(400).json({ balance, message: err })
      // else if (err instanceof NotFound) res.status(404).json({ balance, message: err })
      // else {
      //   console.log(err)
      //   res.status(500).json({ balance, message: err })
    }
  }
};

exports.getPayHistory = async (req, res) => {
  try {
    const uid = req.uid;
    if (!uid) return res.status(401).send(req.jwtMessage);
    const { type, page, limit } = req.query;
    const result = await getPayHistory(
      uid,
      parseIntDefault(page, 1),
      parseIntDefault(limit, 25),
      type === 'order'
    );
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
