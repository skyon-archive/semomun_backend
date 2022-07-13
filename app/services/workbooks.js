const { Items, Workbooks, sequelize } = require('../models/index');
const { Op } = require('sequelize');

exports.fetchWorkbooks = async (page, limit, tids, substring, order) => {
  // console.log('Offset = ', page);
  // console.log('Limit =', limit);
  // console.log('Tids =', tids.length);

  const whereTids = tids.length === 0 ? {} : { tid: { [Op.in]: tids } };
  // console.log('Where Tids =', whereTids);
  const like = `%${substring.replace(/%/, '\\%')}%`;
  const where = substring
    ? {
        [Op.or]: [
          { title: { [Op.like]: like } },
          { author: { [Op.like]: like } },
          { publishCompany: { [Op.like]: like } },
        ],
        type: '',
        wgid: { [Op.is]: null },
      }
    : { type: '', wgid: { [Op.is]: null } };
  const subquery = 'SELECT COUNT(*) FROM WorkbookTags WHERE WorkbookTags.wid = Workbooks.wid';

  const orderType =
    order === 'recentUpload'
      ? ['createdAt', 'DESC']
      : order === 'titleDescending'
      ? ['title', 'DESC']
      : ['title', 'ASC'];
  // console.log('Order =', order);

  const { count, rows } = await Workbooks.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            tids.length === 0
              ? `(${subquery})`
              : `(${subquery} AND WorkbookTags.tid IN (${tids.toString()}))`
          ),
          'matchTags',
        ],
      ],
      exclude: 'type',
    },
    include: { association: 'WorkbookTags', where: whereTids },
    where,
    order: [orderType],
    offset: (page - 1) * limit,
    limit,
    // raw: true,
    // nest: true,
    distinct: true,
    // logging: console.log,
  });
  return { count, workbooks: rows };
};

exports.fetchWorkbooksByWids = async (wids) => {
  return Promise.all(wids.map((wid) => Workbooks.findOne({ where: { wid } })));
};

exports.getPurchasedWorkbooks = async (uid, orderType) => {
  const order =
    orderType === 'solve'
      ? [
          [sequelize.literal('`workbook->workbookHistories`.`datetime`'), 'DESC'],
          [sequelize.literal('`workbook`.`wid`'), 'ASC'],
          [sequelize.literal('`payHistory`.`createdAt`'), 'DESC'],
        ]
      : orderType === 'purchase'
      ? [
          [sequelize.literal('`payHistory`.`createdAt`'), 'DESC'],
          [sequelize.literal('`workbook`.`wid`'), 'ASC'],
        ]
      : [
          [sequelize.literal('`workbook`.`wid`'), 'ASC'],
          [sequelize.literal('`payHistory`.`createdAt`'), 'DESC'],
        ];
  return Items.findAll({
    attributes: [
      [sequelize.col('`workbook`.`wid`'), 'wid'],
      [sequelize.col('`workbook->workbookHistories`.`datetime`'), 'solve'],
    ],
    include: [
      {
        association: 'payHistory',
        where: { uid },
        attributes: ['createdAt'],
        required: true,
      },
      {
        association: 'workbook',
        required: true,
        attributes: [],
        include: {
          association: 'workbookHistories',
          attributes: [],
          where: { uid, type: 'solve' },
          required: false,
        },
      },
    ],
    order,
  });
};
