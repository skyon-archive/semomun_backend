const db = require('../models/index')
const User = db.users

exports.fetch_user = async (req, res) => {
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

exports.update_user = async (req, res) => {
  try {
    console.log(req.body)
    const uid = req.params.uid
    if (await User.findByPk(uid) === null) { res.status(404).send() }

    const userInfo = JSON.parse(req.body)
    const whitelist = ['gender', 'school', 'major', 'majorDetail', 'favoriteCategory', 'graduationStatus', 'birthday']
    if (Object.keys(userInfo).some(r => whitelist.includes(r)) === false) {
      res.status(400).send()
    }

    await User.update(userInfo, { where: { uid: uid } })
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
