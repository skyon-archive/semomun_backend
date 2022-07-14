const { Bootpay } = require('@bootpay/backend-js');
const { UserBillingKeys } = require('../models/index.js');
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

  try {
    Bootpay.setConfiguration({
      application_id: process.env.BOOTPAY_APPLICATION_ID,
      private_key: process.env.BOOTPAY_PRIVATE_KEY,
    });

    await Bootpay.getAccessToken();
    await Bootpay.destroyBillingKey(bkInfo.billing_key);
    await bkInfo.destroy();
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e });
  }
};
