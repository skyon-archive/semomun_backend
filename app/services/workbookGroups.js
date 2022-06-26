const { WorkbookGroups } = require('../models/index.js');
const { Op } = require('sequelize');

exports.selectWorkbookGroups = async (page, limit, tids, keyword) => {
  // Tag 미구현
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
