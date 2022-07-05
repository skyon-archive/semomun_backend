const { Op } = require('sequelize');
const { Workbooks, sequelize } = require('../models/index.js');

exports.selectWorkbooks = async (offset, limit, keyword, order) => {
  const like = `%${keyword.replace(/%/, '\\%')}%`;

  const { count, rows } = await Workbooks.findAndCountAll({
    attributes: [
      'wid',
      'title',
      'author',
      'publishCompany',
      'createdAt',
      'updatedAt',
      ['type', 'isHidden'],
      [sequelize.col('`item`.`originalPrice`'), 'originalPrice'],
      [sequelize.col('`item`.`price`'), 'price'],
    ],
    include: {
      association: 'item',
      attributes: ['originalPrice', 'price'],
      required: true,
    },
    where: { title: { [Op.like]: like } },
    offset: (offset - 1) * limit,
    limit,
    order: [['createdAt', order]],
  });
  return { count, rows };
};
