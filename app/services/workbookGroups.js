const {
  WorkbookGroups,
  // Workbooks,
  // Items,
  sequelize,
  // Sections,
  // WorkbookGroupHistory,
} = require('../models/index.js');
const { Op } = require('sequelize');

exports.selectWorkbookGroups = async (page, limit, tids, keyword, order) => {
  // // Tag 미구현
  const like = `%${keyword.replace(/%/, '\\%')}%`;
  // console.log(tids);
  const tidsWhere = tids.length === 0 ? {} : { tid: { [Op.in]: tids } };
  const where = keyword
    ? {
        [Op.or]: [{ title: { [Op.like]: like } }, { detail: { [Op.like]: like } }],
        type: 'MOCK_K_SAT',
      }
    : { type: 'MOCK_K_SAT' };

  const orderType =
    order === 'recentUpload'
      ? ['createdAt', 'DESC']
      : order === 'titleDescending'
      ? ['title', 'DESC']
      : ['title', 'ASC'];

  const { count, rows } = await WorkbookGroups.findAndCountAll({
    include: {
      association: 'workbooks',
      attributes: {
        include: [[sequelize.literal('`paperbookPrice`'), 'originalPrice']],
      },
      where: { wid: { [Op.not]: null }, type: '' },
      required: true,
      include: {
        association: 'WorkbookTags',
        where: tidsWhere,
        required: true,
        // include: { association: 'tid_Tag' },
      },
    },
    where,
    offset: (page - 1) * limit,
    limit,
    order: [orderType],
    distinct: true,
  });
  return { count, workbookGroups: rows };
};

// 이건 진짜
exports.selectOneWorkbookGroup = async (wgid) => {
  const workbookgroup = await WorkbookGroups.findOne({
    include: {
      association: 'workbooks',
      attributes: { exclude: ['type'], include: [[sequelize.literal('`paperbookPrice`'), 'originalPrice']] },
      include: [
        { association: 'sections', order: [['index', 'ASC']] },
        { association: 'item', attributes: ['price', 'sales'] },
        { association: 'WorkbookTags', include: { association: 'tid_Tag' } },
      ],
    },
    where: { wgid },
  });
  return workbookgroup;
};

// 책장
exports.selectPurchasedWorkbookGroups = async (uid, orderType) => {
  const order =
    orderType === 'solve'
      ? [
          [sequelize.literal('`workbookgroupHistories`.`datetime`'), 'DESC'],
          [sequelize.literal('`workbooks->item->payHistory`.`createdAt`'), 'DESC'],
        ]
      : [
          [sequelize.literal('`workbooks->item->payHistory`.`createdAt`'), 'DESC'],
          [sequelize.literal('`workbookgroupHistories`.`datetime`'), 'DESC'],
        ];
  const result = await WorkbookGroups.findAll({
    attributes: ['wgid', [sequelize.col('`workbookgroupHistories`.`datetime`'), 'solve']],
    include: [
      { association: 'workbookgroupHistories', attributes: ['datetime'] }, // 여기 수정했는데? 배포가 안되네?
      {
        association: 'workbooks',
        attributes: ['wid'],
        where: { wgid: { [Op.not]: null } },
        include: [
          {
            association: 'item',
            attributes: ['id'],
            required: true,
            include: {
              association: 'payHistory',
              where: { uid },
              attributes: ['uid', 'createdAt'],
            },
          },
        ],
      },
    ],
    where: { type: 'MOCK_K_SAT' },
    order: order,
  });
  return result;
};
