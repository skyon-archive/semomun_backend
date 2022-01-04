const db = require('../models/index')
const User = db.users
const Op = db.Sequelize.Op

exports.get = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uid: req.params.uid
      },
      raw: true
    })
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
