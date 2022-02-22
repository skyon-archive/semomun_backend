module.exports = function (sequelize, DataTypes) {
  return sequelize.define('WorkbookTags', {
    wid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Workbooks',
        key: 'wid'
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
    tableName: 'WorkbookTags',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'wid' },
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
