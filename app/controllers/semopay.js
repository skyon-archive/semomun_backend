const { Bootpay } = require('@bootpay/backend-js');
const { UserBillingKeys, BootPayWebhook, SemopayOrder } = require('../models/index.js');
const {
  selectUserBillingKeysByUid,
  selectAnUserBillingKeyByInfo,
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
  const { bkid, order_name, price } = req.body;

  /**
   * 필수값 목록 =>
   * billing_key
   * order_name
   * order_id
   * price
   * ------------------------------
   * 근데 내가 받을건
   * bkid
   * order_name,
   * price
   * 이렇게 3개,
   */

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
    await SemopayOrder.create(payResult);

    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};
