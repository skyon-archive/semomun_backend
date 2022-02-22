module.exports = function (sequelize, DataTypes) {
  return sequelize.define('FavoriteTags', {
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    tid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Tags',
        key: 'tid'
      }
    }
  }, {
    sequelize,
    tableName: 'FavoriteTags',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'uid' },
          { name: 'tid' }
        ]
      },
      {
        name: 'tid',
        using: 'BTREE',
        fields: [
          { name: 'tid' }
        ]
      }
    ]
  })
}
