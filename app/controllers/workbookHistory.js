const { BadRequest } = require('../errors')
const { WorkbookHistory, sequelize } = require('../models/index')

exports.startWorkbook = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    const { wid, datetime } = req.body
    if (!wid || !datetime) throw new BadRequest()

    await sequelize.transaction(async (transaction) => {
      const history = await WorkbookHistory.findOne({
        where: { uid, wid, type: 'start' },
        transaction
      })
      const date = new Date(datetime)
      if (history) {
        if (date > history.datetime) {
          await history.update(
            { datetime: date },
            { transaction }
          )
        }
      } else {
        await WorkbookHistory.create(
          { uid, wid, type: 'start', datetime: date },
          { transaction }
        )
      }
    })
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
