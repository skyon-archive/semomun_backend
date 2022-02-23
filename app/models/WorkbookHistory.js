module.exports = function (sequelize, DataTypes) {
  return sequelize.define('WorkbookHistory', {
    whid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    wid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Workbooks',
        key: 'wid'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'WorkbookHistory',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'whid' }
        ]
      },
      {
        name: 'wid',
        using: 'BTREE',
        fields: [
          { name: 'wid' }
        ]
      },
      {
        name: 'uid',
        using: 'BTREE',
        fields: [
          { name: 'uid' }
        ]
      }
    ]
  })
}
