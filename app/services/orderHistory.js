const { CustomError } = require('../errors')
const { OrderHistory, sequelize } = require('../models/index')

exports.createOrders = async (orders) => {
  const whitelist = ['id', 'uid', 'payment', 'createdAt', 'updatedAt']
  orders.forEach(order => Object.keys(order).forEach((key) => {
    if (!whitelist.includes(key)) {
      throw new CustomError(`${key} is not a valid key`)
    }
  }))

  await sequelize.transaction(async (transaction) => {
    await OrderHistory.bulkCreate(orders, { transaction })
  })
}
