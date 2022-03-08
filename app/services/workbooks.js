const { Items, sequelize } = require('../models/index')

exports.getPurchasedWorkbooks = async (uid, orderType) => {
  const order = orderType === 'solve'
    ? [
        [sequelize.literal('`workbook->workbookHistories`.`datetime`'), 'DESC'],
        [sequelize.literal('`workbook`.`wid`'), 'ASC'],
        [sequelize.literal('`payHistory`.`createdAt`'), 'DESC']
      ]
    : orderType === 'purchase'
      ? [
          [sequelize.literal('`payHistory`.`createdAt`'), 'DESC'],
          [sequelize.literal('`workbook`.`wid`'), 'ASC']
        ]
      : [
          [sequelize.literal('`workbook`.`wid`'), 'ASC'],
          [sequelize.literal('`payHistory`.`createdAt`'), 'DESC']
        ]
  return Items.findAll({
    attributes: [
      [sequelize.col('`workbook`.`wid`'), 'wid'],
      [sequelize.col('`workbook->workbookHistories`.`datetime`'), 'solve']
    ],
    include: [
      {
        association: 'payHistory',
        where: { uid },
        attributes: ['createdAt'],
        required: true
      },
      {
        association: 'workbook',
        required: true,
        attributes: [],
        include: {
          association: 'workbookHistories',
          attributes: [],
          where: { uid, type: 'solve' },
          required: false
        }
      }
    ],
    order
  })
}
