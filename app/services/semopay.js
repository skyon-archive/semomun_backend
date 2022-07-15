const { Op } = require('sequelize');
const { UserBillingKeys, PayHistory, sequelize } = require('../models/index.js');

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

exports.selectPayHistoriesByUid = async (uid, type) => {
  //   const filterType =
  //     type === 'all' ? {} : type === 'charge' ? { type: 'charge' } : { type: { [Op.not]: 'charge' } };
  return await PayHistory.findAll({
    attributes: [
      'phid',
      //   'uid',
      //   'id',
      [sequelize.col('`item->workbook`.`title`'), 'title'],
      'amount',
      //   'balance',
      'type',
      'createdAt',
      'updatedAt',
    ],
    // attributes: {
    //   exclude: ['uid', 'balance'],
    // },
    where: { uid },
    include: {
      association: 'item',
      attributes: [],
      include: {
        association: 'workbook',
        attributes: ['title'],
      },
    },
    order: [['createdAt', 'DESC']],
  });
};
