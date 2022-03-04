
const { CustomError } = require('../errors')

const useCredit = async (sequelize, orders, transaction) => {
  const payments = {}
  orders.forEach(({ uid, payment }) => {
    payments[uid] = (payments[uid] ?? 0) + payment
  })
  const Users = sequelize.models.Users
  for (const uid in payments) {
    const user = await Users.findByPk(uid, { transaction })
    if (user.credit < payments[uid]) throw new CustomError('NOT_ENOUGH_CREDIT')
    Users.update(
      { credit: sequelize.literal(`credit - ${payments[uid]}`) },
      { where: { uid }, transaction }
    )
  }
}

const increaseSale = async (sequelize, orders, transaction) => {
  await Promise.all(orders.map(({ id }) => sequelize.models.Items.update(
    { sales: sequelize.literal('sales + 1') },
    { where: { id }, transaction }
  )))
}

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
      afterCreate: async (order, options) => {
        await useCredit(sequelize, [order], options.transaction)
        await increaseSale(sequelize, [order], options.transaction)
      },
      afterBulkCreate: async (orders, options) => {
        await useCredit(sequelize, orders, options.transaction)
        await increaseSale(sequelize, orders, options.transaction)
      }
    }
  })
}
