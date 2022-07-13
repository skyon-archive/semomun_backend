const { parseIntDefault, parseIntList } = require('../utils.js');
const { Bootpay } = require('@bootpay/backend-js');

const {
  selectWorkbookGroups,
  selectOneWorkbookGroup,
  selectPurchasedWorkbookGroups,
} = require('../services/workbookGroups.js');
const { UserBillingKeys } = require('../models/index.js');
const { selectUserBillingKeysByUid } = require('../services/semopay.js');

exports.createUserBillingKeys = async (req, res) => {
  const uid = req.uid;
  if (!uid) return res.status(401).json({ message: 'Invalid Token' });
  const { receipt_id } = req.body;

  try {
    Bootpay.setConfiguration({
      application_id: '61d43475e38c30001f7b76c4',
      private_key: 'Xo+Zi0WZOaSU7LsHxoPGbKnfhT8Y5b5z73T11ojWYJ4=',
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
  if (!uid) return res.status(401).json({ message: 'Invalid Token' });
  const userBillingKeys = await selectUserBillingKeysByUid(uid);
  res.status(200).json({ billingKeys: userBillingKeys });
};
