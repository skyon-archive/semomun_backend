const { Op } = require('sequelize');
const { UserBillingKeys } = require('../models/index.js');

exports.selectUserBillingKeysByUid = async (uid) => {
  return await UserBillingKeys.findAll({
    attributes: ['bkid', 'billing_data'],
    where: { uid, deletedAt: { [Op.is]: null } },
    order: [['createdAt', 'DESC']],
  });
};

exports.selectAnUserBillingKeyByInfo = async (bkid, uid) => {
  return await UserBillingKeys.findOne({
    where: { bkid, uid },
  });
};
