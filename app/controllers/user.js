const db = require('../models/index')
const User = db.users

exports.get = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        uid: req.params.uid
      },
      attributes: { exclude: ['googleId', 'appleId', 'auth'] },
      raw: true
    })
    if (user === null) {
      res.status(404).send()
    } else {
      res.json(user)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
