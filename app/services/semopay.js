const { UserBillingKeys } = require('../models/index.js');

exports.selectUserBillingKeysByUid = async (uid) => {
  return await UserBillingKeys.findAll({
    attributes: ['bkid', 'billing_data'],
    where: { uid },
    order: [['createdAt', 'DESC']],
  });
};

exports.selectAnUserBillingKeyByInfo = async (bkid, uid, billing_key) => {
  return await UserBillingKeys.findOne({
    where: { bkid, uid, billing_key },
  });
};
