const { Op } = require('sequelize');
const {
  UserBillingKeys,
  PayHistory,
  sequelize,
  Users,
  SemopayOrder,
} = require('../models/index.js');

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
  const endDate = new Date();
  const tempMonth = endDate.getMonth() - 5; // 최근 6개월만 조회
  const tempYear = endDate.getFullYear();
  const month = tempMonth < 0 ? tempMonth + 12 : tempMonth;
  const year = tempMonth < 0 ? tempYear - 1 : tempYear;
  const startDate = new Date(year, month, 1, 0, 0, 0);
  const createdAt = { [Op.between]: [startDate, endDate] };

  const where =
    type === 'charge'
      ? { uid, type: 'charge', createdAt }
      : type === 'order'
      ? { uid, type: 'order', createdAt }
      : { uid, createdAt };
  return await PayHistory.findAll({
    attributes: [
      'phid',
      [sequelize.col('`item->workbook`.`title`'), 'title'],
      'amount',
      'type',
      'createdAt',
      'updatedAt',
    ],
    where,
    include: {
      association: 'item',
      attributes: [],
      include: {
        association: 'workbook',
        attributes: ['title'],
      },
    },
    order: [['createdAt', 'DESC']],
    logging: console.log,
  });
};

exports.selectUsersByUid = async (uid) => {
  return await Users.findOne({ where: { uid } });
};

exports.selectSemopayOrdersByUid = async (uid) => {
  const endDate = new Date();
  console.log(endDate.getFullYear());
  //   console.log(endDate.getMonth());
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1, 0, 0, 0);
  console.log('startDate =', startDate);
  console.log('endDate =', endDate);
  const createdAt = { [Op.between]: [startDate, endDate] };
  return await SemopayOrder.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'price']],
    // attributes: ['price'],
    // where: { uid },
    where: { uid, createdAt },
    // logging: console.log,
    // order: [['createdAt', 'DESC']],
  });
};

exports.selectUsingAutoChargeCardNow = async (uid) => {
  return await UserBillingKeys.findOne({ where: { uid, isAutoCharged: true } });
};

exports.selectUsersAnBillingKeyForAutoCharge = async (uid, bkid) => {
  return await UserBillingKeys.findOne({ where: { uid, bkid, deletedAt: { [Op.is]: null } } });
};
