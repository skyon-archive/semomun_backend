const { UserBillingKeys } = require('../models/index.js');

exports.selectUserBillingKeysByUid = async (uid) => {
  return await UserBillingKeys.findAll({
    attributes: ['bkid', 'billing_key', 'billing_data'],
    where: { uid },
  });
};
