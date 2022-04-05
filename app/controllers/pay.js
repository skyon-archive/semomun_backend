const { BadRequest, NotFound } = require('../errors')
const { parseIntDefault } = require('../utils')
const { createOrders, getPayHistory } = require('../services/payHistory')

exports.createOrders = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send(req.jwtMessage)

    const { ids } = req.body
    if (!Array.isArray(ids)) throw new BadRequest('WRONG_BODY')

    const balance = await createOrders(uid, ids)

    res.json({ balance }).send()
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof NotFound) res.status(404).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

exports.getPayHistory = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send(req.jwtMessage)
    const { type, page, limit } = req.query
    const result = await getPayHistory(
      uid,
      parseIntDefault(page, 1),
      parseIntDefault(limit, 25),
      type === 'order'
    )
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
