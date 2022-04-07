const { Notices } = require('../models/index')

exports.getNotices = async (req, res) => {
  try {
    const result = await Notices.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
