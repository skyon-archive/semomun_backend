const updateCredit = async (sequelize, payHistories, transaction) => {
  const balances = {}
  for (const { uid, amount, balance, type } of payHistories) {
    // console.log('Uid =', uid);
    // console.log('amount =', amount);
    // console.log('balance =', balance);

    if (balances[uid] === undefined) {
      const user = await sequelize.models.Users.findByPk(uid, { transaction })
      balances[uid] = user.credit
    }
    // console.log('BUID 111 =', balances[uid]);
    if (type === 'order') balances[uid] -= amount;
    else balances[uid] += amount;

    // console.log('BUID 222 =', balances[uid]);
    if (balances[uid] !== balance) throw new Error('BALANCE_NOT_MATCH')
  }
  for (const uid in balances) {
    await sequelize.models.Users.update(
      { credit: balances[uid] },
      { where: { uid }, transaction }
    )
  }
}

const increaseSale = async (sequelize, payHistories, transaction) => {
  await Promise.all(payHistories.map(async ({ type, id }) => {
    if (type.startsWith('order') && id) {
      await sequelize.models.Items.update(
        { sales: sequelize.literal('sales + 1') },
        { where: { id }, transaction }
      )
    }
  }))
}

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('PayHistory', {
    phid: {
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
    soid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'SemopayOrder',
        key: 'soid',
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
          { name: 'phid' }
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
        await updateCredit(sequelize, [order], options.transaction)
        await increaseSale(sequelize, [order], options.transaction)
      },
      afterBulkCreate: async (orders, options) => {
        await updateCredit(sequelize, orders, options.transaction)
        await increaseSale(sequelize, orders, options.transaction)
      }
    }
  })
}
