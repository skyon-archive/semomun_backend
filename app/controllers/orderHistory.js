const { createOrders } = require('../services/orderHistory')

exports.createOrders = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    const orders = req.body
    if (!Array.isArray(orders)) return res.status(400).send()

    const now = new Date()
    orders.forEach((order) => {
      order.createdAt = now
      order.updatedAt = now
      order.uid = uid
    })

    try {
      await createOrders(orders)
    } catch (err) {
      return res.status(400).send(err.message)
    }
    res.json({}).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
