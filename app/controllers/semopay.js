const { Bootpay } = require('@bootpay/backend-js');
const { UserBillingKeys, BootPayWebhook, SemopayOrder } = require('../models/index.js');
const {
  selectUserBillingKeysByUid,
  selectAnUserBillingKeyByInfo,
  selectPayHistoriesByUid,
  selectUsersByUid,
  selectSemopayOrdersByUid,
} = require('../services/semopay.js');

exports.createUserBillingKey = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });

  const { receipt_id } = req.body;

  try {
    Bootpay.setConfiguration({
      application_id: process.env.BOOTPAY_APPLICATION_ID,
      private_key: process.env.BOOTPAY_PRIVATE_KEY,
    });

    await Bootpay.getAccessToken();

    const resultBillingKeys = await Bootpay.lookupSubscribeBillingKey(receipt_id);
    resultBillingKeys.uid = uid;

    await UserBillingKeys.create(resultBillingKeys);
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

exports.getUserBillingKeysByUid = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });

  const userBillingKeys = await selectUserBillingKeysByUid(uid);
  res.status(200).json({ billingKeys: userBillingKeys });
};

exports.deleteUserBillingKey = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });

  const { bkid } = req.params;
  const bkInfo = await selectAnUserBillingKeyByInfo(bkid, uid);

  if (!bkInfo) return res.status(404).json({ message: 'Invalid Bk Info.' });
  if (bkInfo.deletedAt) return res.status(403).json({ message: 'Already deleted Info.' });

  try {
    Bootpay.setConfiguration({
      application_id: process.env.BOOTPAY_APPLICATION_ID,
      private_key: process.env.BOOTPAY_PRIVATE_KEY,
    });

    await Bootpay.getAccessToken();
    await Bootpay.destroyBillingKey(bkInfo.billing_key);
    bkInfo.deletedAt = new Date();
    bkInfo.save();
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

exports.bootPayWebhook = async (req, res) => {
  // BootPay에서 주는 Webhook을 받는 API
  const { body } = req.body;
  await BootPayWebhook.create(body);
  res.status(201).json({ success: true });
};

exports.createSemopayOrder = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });
  const { bkid, order_name, price } = req.body;

  // Origin Values => billing_key, order_name, order_id, price
  // Expected Values => bkid, order_name, price

  // Validate UserBillingKeys
  const bkInfo = await selectAnUserBillingKeyByInfo(bkid, uid);
  if (!bkInfo) return res.status(404).json({ message: 'Invalid Bk Info.' });
  if (bkInfo.deletedAt) return res.status(409).json({ message: 'Already deleted Info.' });
  const billing_key = bkInfo.billing_key;

  // Validate Users
  //   Users.findOne({where: {uid}})

  try {
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
    payResult.uid = uid;
    payResult.bkid = bkid;
    await SemopayOrder.create(payResult);

    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

exports.getSemopayOrders = async (req, res) => {
  const uid = req.uid;
  let { type } = req.query;
  if (!type || type !== 'charge' || type !== 'order') type = 'all';
  const result = await selectPayHistoriesByUid(uid, type);
  res.status(200).json({ semopayHistories: result });
};

exports.getSemopay = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });

  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });

  //   console.log('# ----- User Info ----- #');
  //   console.log(userInfo);
  const currentSemopay = userInfo.credit;
  //   console.log('Current Semopay =', currentSemopay);

  const sumSemopay = await selectSemopayOrdersByUid(uid);
  const maxChargeSemopay = process.env.MAX_CHARGE_SEMOPAY;
  const rechargeableSemopay =
    maxChargeSemopay - (sumSemopay[0].price === null ? 0 : parseInt(sumSemopay[0].price));
  res.status(200).json({ currentSemopay, rechargeableSemopay });
};
