const { Items, Workbooks, sequelize } = require('../models/index')
const { Op } = require('sequelize')

exports.fetchWorkbooks = async (page, limit, tids, substring) => {
  const like = `%${substring.replace(/%/, '\\%')}%`
  const where = substring
    ? {
        [Op.or]: [
          { title: { [Op.like]: like } },
          { author: { [Op.like]: like } },
          { publishCompany: { [Op.like]: like } }
        ]
      }
    : undefined
  const { count, rows } = await Workbooks.findAndCountAll({
    attributes: {
      include: [[
        sequelize.literal(
          `(SELECT COUNT(*) FROM WorkbookTags WHERE WorkbookTags.wid = Workbooks.wid AND WorkbookTags.tid IN (${tids.toString()}))`
        ),
        'matchTags'
      ]]
    },
    where,
    offset: (page - 1) * limit,
    limit,
    order: [
      [sequelize.literal('MatchTags'), 'DESC'], ['wid', 'ASC'],
      ['wid', 'ASC']
    ],
    raw: true,
    nest: true
  })
  return { count, workbooks: rows }
}

exports.fetchWorkbooksByWids = async (wids) => {
  return Promise.all(wids.map((wid) => Workbooks.findOne({ where: { wid } })))
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
