const { Items, Workbooks, sequelize } = require('../models/index')

exports.fetchWorkbooks = async (page, limit) => {
  const { count, rows } = await Workbooks.findAndCountAll({
    offset: (page - 1) * limit,
    limit,
    order: [['wid', 'ASC']]
  })
  return { count, workbooks: rows }
}

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
