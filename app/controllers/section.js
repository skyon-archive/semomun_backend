const db = require('../models/index')
const View = db.views
const Problem = db.problems
const Op = db.Sequelize.Op

exports.get = async (req, res) => {
  try {
    const views = await View.findAll({
      where: {
        sid: req.params.sid
      },
      raw: true
    })
    await Promise.all(
      views.map(async (view) => {
        view.problems = await Problem.findAll({
          where: {
            sid: req.params.sid,
            icon_index: {
              [Op.between]: [view.index_start, view.index_end]
            }
          },
          raw: true
        })
      })
    )
    res.json(views)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
