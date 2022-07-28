const { Op } = require('sequelize');
const { Tags, FavoriteTags, sequelize } = require('../models/index');

exports.getTagsOrderBy = async (orderBy, cidBy) => {
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
  const where = cidBy === 'all' ? undefined : { cid: cidBy };
  const { count, rows } = await Tags.findAndCountAll({
    attributes: [
      'tid',
      'name',
      'createdAt',
      'updatedAt',
      [
        sequelize.literal('(SELECT COUNT(*) FROM FavoriteTags WHERE FavoriteTags.tid = Tags.tid)'),
        'UserCount',
      ],
      [
        sequelize.literal('(SELECT COUNT(*) FROM WorkbookTags WHERE WorkbookTags.tid = Tags.tid)'),
        'WorkbookCount',
      ],
    ],
    include: { association: 'category', attributes: ['cid', 'name'], where, required: false },
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
