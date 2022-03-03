const useCredit = (sequelize, { payment, uid }, { transaction }) => sequelize.models.Users.update(
  { credit: sequelize.literal(`credit - ${payment}`) },
  { where: { uid }, transaction }
)

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('OrderHistory', {
    ohid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
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
    payment: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'OrderHistory',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'ohid' }
        ]
      },
      {
        name: 'id',
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'uid',
        using: 'BTREE',
        fields: [
          { name: 'uid' }
        ]
      }
    ],
    hooks: {
      afterCreate: (order, options) => {
        return useCredit(sequelize, order, options)
      },
      afterBulkCreate: async (orders, options) => {
        await Promise.all(
          orders.map(order => useCredit(sequelize, order, options))
        )
      }
    }
  })
}
