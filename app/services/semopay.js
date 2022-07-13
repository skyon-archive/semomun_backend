// const { UserBillingKeys, sequelize } = require('../models/index.js');
// const { Op } = require('sequelize');

// // 이건 진짜
// exports.selectOneWorkbookGroup = async (wgid) => {
//   const workbookgroup = await WorkbookGroups.findOne({
//     include: {
//       association: 'workbooks',
//       attributes: { exclude: ['type'] },
//       include: [
//         { association: 'sections', order: [['index', 'ASC']] },
//         { association: 'item', attributes: ['price', 'sales'] },
//         { association: 'WorkbookTags', include: { association: 'tid_Tag' } },
//       ],
//     },
//     where: { wgid },
//   });
//   return workbookgroup;
// };
