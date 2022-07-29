const { Categories, sequelize } = require('../models/index.js');

exports.selectAllCategories = async () => {
  return await Categories.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(SELECT COUNT(*) FROM Tags WHERE Categories.cid = Tags.cid)`),
          'tagCount',
        ],
      ],
    },
    include: { attributes: [], association: 'tags', required: false },
    order: [['name', 'ASC']],
    distinct: true,
  });
};
