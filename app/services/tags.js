const { Tags, FavoriteTags, sequelize } = require('../models/index');

exports.getTagsOrderBy = async (orderBy) => {
  const order =
    orderBy === 'popularity'
      ? [
          [sequelize.literal('UserCount'), 'DESC'],
          [sequelize.literal('WorkbookCount'), 'DESC'],
          ['tid', 'ASC'],
        ]
      : orderBy === 'name'
      ? [['name', 'ASC']]
      : [['tid', 'ASC']];
  const { count, rows } = await Tags.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM FavoriteTags WHERE FavoriteTags.tid = Tags.tid)'
          ),
          'UserCount',
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM WorkbookTags WHERE WorkbookTags.tid = Tags.tid)'
          ),
          'WorkbookCount',
        ],
      ],
    },
    order,
  });
  return { count, tags: rows };
};

exports.getTagsByUid = (uid) => {
  return FavoriteTags.findAll({
    include: {
      association: 'tid_Tag',
      required: true,
      include: { association: 'category', attributes: ['cid', 'name'] },
    },
    where: { uid },
    order: [['createdAt', 'ASC']],
  });
};
