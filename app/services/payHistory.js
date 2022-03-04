const { BadRequest, NotFound } = require('../errors')
const { PayHistory, Items, Users, sequelize } = require('../models/index')

exports.createOrders = async (uid, ids) => {
  return await sequelize.transaction(async (transaction) => {
    const now = new Date()
    let balance = (await Users.findByPk(uid, { transaction })).credit
    const orders = await Promise.all(ids.map(async (id) => {
      const item = await Items.findByPk(id, { transaction })
      if (!item) throw new NotFound('WRONG_ID')
      balance -= item.price
      if (balance < 0) throw new BadRequest('NOT_ENOUGH_CREDIT')
      return {
        id,
        uid,
        amount: item.price,
        balance,
        type: 'order',
        createdAt: now,
        updatedAt: now
      }
    }))
    await PayHistory.bulkCreate(orders, { transaction })
    return balance
  })
}

exports.getPayHistory = async (uid, page, limit, onlyOrder = false) => {
  const { count, rows } = await PayHistory.findAndCountAll({
    where: onlyOrder ? { uid } : { uid, type: 'order' },
    order: [
      ['createdAt', 'DESC'],
      ['phid', 'ASC']
    ],
    include: {
      association: 'item',
      include: 'workbook'
    },
    offset: (page - 1) * limit,
    limit
  })
  return { count, history: rows }
}
