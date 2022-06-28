const { WorkbookGroups, Workbooks, Items, sequelize, Sections } = require('../models/index.js');
const { Op } = require('sequelize');

exports.selectWorkbookGroups = async (page, limit, tids, keyword) => {
  // // Tag 미구현
  const like = `%${keyword.replace(/%/, '\\%')}%`;
  const where = keyword
    ? {
        [Op.or]: [{ title: { [Op.like]: like } }, { detail: { [Op.like]: like } }],
        type: 'MOCK_K_SAT',
      }
    : { type: 'MOCK_K_SAT' };

  const { count, rows } = await WorkbookGroups.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit,
  });
  return { count, workbookGroups: rows };
};

exports.selectOneWorkbookGroup = async (wgid) => {
  const workbookgroup = await WorkbookGroups.findOne({
    include: [{ model: Workbooks, as: 'workbooks', include: [{model: Sections, as: 'sections'}]}],
    where: { wgid },
  });
  return workbookgroup;
};

exports.selectPurchasedWorkbookGroups = async (uid, orderType) => {
  // 여기에 상위 모델인 WorkbookGroups와 한 번더 조인을 해야 함.
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
        where: { wgid: { [Op.not]: null } },
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
