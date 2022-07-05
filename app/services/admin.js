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
      [sequelize.col('`item`.`originalPrice`'), 'originalPrice'],
      [sequelize.col('`item`.`price`'), 'price'],
      ['type', 'isHidden'],
      'createdAt',
      'updatedAt',
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

exports.selectWorkbookByWid = async (wid) => {
  return await Workbooks.findOne({
    attributes: [
      'wid',
      'title',
      'author',
      'publishCompany',
      'bookcover',
      [sequelize.col('`item`.`originalPrice`'), 'originalPrice'],
      [sequelize.col('`item`.`price`'), 'price'],
      [sequelize.col('`item`.`sales`'), 'sales'],
      ['type', 'isHidden'],
      'createdAt',
      'updatedAt',
    ],
    include: {
      association: 'item',
      attributes: ['originalPrice', 'price', 'sales'],
      required: true,
    },
    where: { wid },
  });
};
