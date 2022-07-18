const { Bootpay } = require('@bootpay/backend-js');
const { Op } = require('sequelize');
const { UserBillingKeys, BootPayWebhook, SemopayOrder, PayHistory } = require('../models/index.js');
const {
  selectUserBillingKeysByUid,
  selectAnUserBillingKeyByInfo,
  selectPayHistoriesByUid,
  selectUsersByUid,
  selectSemopayOrdersByUid,
  selectUsingAutoChargeCardNow,
} = require('../services/semopay.js');
const { MAX_CHARGE_SEMOPAY } = require('../../server.js');

const rechargeableSemopayController = async (uid) => {
  // console.log('MAX_CHARGE_SEMOPAY =', MAX_CHARGE_SEMOPAY)
  const sumSemopay = await selectSemopayOrdersByUid(uid);
  const maxChargeSemopay = parseInt(MAX_CHARGE_SEMOPAY);
  return maxChargeSemopay - (sumSemopay[0].price === null ? 0 : parseInt(sumSemopay[0].price));
};

// const validateAutoChargeAmount = async (lessThenAmount, chargeAmount) => {};

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
  // console.log('userBillingKeys =', userBillingKeys);
  res.status(200).json({ billingKeys: userBillingKeys });
};

exports.deleteUserBillingKey = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });
  // Validate Users
  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });

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

    if (bkInfo.isAutoCharged === true) {
      userInfo.isAutoCharged = false;
      userInfo.save();
    }

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

/**
 * 수동결제 API입니다.
 * 갖고있는 빌링키를 이용해 결제를 할 때 필요한 값들은 billing_key, order_name, order_id, price 이지만,
 * 우리가 알아야 할 정보는 order_name, price 그리고 uid 입니다.
 * uid로 빌링키를 가져올 수 있으며, order_id는 고유한 값으로(new Date())로 처리합니다.
 */
exports.createSemopayOrder = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });
  // Validate Users
  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });
  const { bkid, order_name, price } = req.body;
  const balance = price + userInfo.credit;
  // console.log('balance =', balance);
  // console.log('bkid =', bkid);
  // console.log('order_name =', order_name);
  // console.log('price =', price);

  // 소지 가능한 금액 한도 초과시, 월 충전 가능한 금액 한도 초과시
  const rechargeableSemopay = await rechargeableSemopayController(uid);
  if (balance > MAX_CHARGE_SEMOPAY || price > rechargeableSemopay) {
    userInfo.isAutoCharged = false;
    userInfo.save();
    return res.status(403).json({ message: 'The chargeable amount has been exceeded.' });
  }

  // Validate UserBillingKeys
  if (!bkid) return res.status(404).json({ message: 'Invalid Bk Info.' });
  const bkInfo = await selectAnUserBillingKeyByInfo(bkid, uid);
  if (!bkInfo) return res.status(404).json({ message: 'Invalid Bk Info.' });
  if (bkInfo.deletedAt) return res.status(409).json({ message: 'Already deleted Info.' });
  const billing_key = bkInfo.billing_key;
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
    const soInfo = await SemopayOrder.create(payResult);
    // console.log('This is SemopayOrder Instance =', soInfo);
    const soid = soInfo.soid;
    await PayHistory.create({
      uid,
      soid,
      amount: price,
      balance,
      type: 'charge',
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};

exports.getSemopayOrders = async (req, res) => {
  const uid = req.uid;
  let { type } = req.query;
  //   console.log('Type =', type);
  if (!type) type = 'all';
  //   console.log('Type =', type);
  const result = await selectPayHistoriesByUid(uid, type);
  res.status(200).json({ semopayHistories: result });
};

exports.getSemopay = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });

  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });

  const currentSemopay = userInfo.credit;
  const rechargeableSemopay = await rechargeableSemopayController(uid);
  res.status(200).json({ currentSemopay, rechargeableSemopay });
};

exports.getAutoChargeInfo = async (req, res) => {
  console.log('# ----- 자동 충전 정보 수정 API ----- #');
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });
  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });
  const isAutoCharged = userInfo.isAutoCharged;
  const lessThenAmount = userInfo.lessThenAmount;
  const chargeAmount = userInfo.chargeAmount;
  const bkInfo = await selectUsingAutoChargeCardNow(uid);
  // console.log(bkInfo);
  const bkid = bkInfo === null ? null : bkInfo?.bkid;
  res.status(200).json({ isAutoCharged, lessThenAmount, chargeAmount, bkid });
};

exports.putAutoChargeInfo = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token.' });
  const userInfo = await selectUsersByUid(uid);
  if (!userInfo) return res.status(404).json({ message: 'User does not exist.' });
  if (userInfo.deletedAt) return res.status(403).json({ message: 'Already deleted User.' });

  const { isAutoCharged, lessThenAmount, chargeAmount, bkid } = req.body;
  //   console.log('isAutoCharged =', isAutoCharged);
  //   console.log('lessThenAmount =', lessThenAmount);
  //   console.log('chargeAmount =', chargeAmount);
  //   console.log('bkid =', bkid);

  try {
    // Update User Info
    await userInfo.set({ isAutoCharged, lessThenAmount, chargeAmount }).save();

    // 우선 모든 카드를, 자동충전 미사용 카드로 변경.
    await UserBillingKeys.update(
      { isAutoCharged: false },
      { where: { uid, deletedAt: { [Op.is]: null } } }
    );

    // 받은 bkid만 사용 카드로 변경.
    await UserBillingKeys.update(
      { isAutoCharged: true },
      { where: { uid, bkid, deletedAt: { [Op.is]: null } } }
    );

    res.status(204).send();
  } catch (err) {
    console.log('err =', err);
    res.status(400).json({ message: err });
  }
};
