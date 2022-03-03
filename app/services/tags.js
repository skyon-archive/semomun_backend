const { Tags, sequelize } = require('../models/index')

exports.getTagsOrderByPopularity = async (page, limit) => {
  const { count, rows } = await Tags.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM FavoriteTags WHERE FavoriteTags.tid = Tags.tid)'
          ),
          'UserCount'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM WorkbookTags WHERE WorkbookTags.tid = Tags.tid)'
          ),
          'WorkbookCount'
        ]
      ]
    },
    order: [
      [sequelize.literal('UserCount'), 'DESC'],
      [sequelize.literal('WorkbookCount'), 'DESC'],
      ['tid', 'ASC']
    ],
    offset: (page - 1) * limit,
    limit
  })
  return { count, tags: rows }
}
