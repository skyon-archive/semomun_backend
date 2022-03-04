module.exports = function (sequelize, DataTypes) {
  return sequelize.define('PayHistory', {
    chid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Items',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PayHistory',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'chid' }
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
