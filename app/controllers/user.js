const { getUserWithGoogle, getUserWithApple } = require('../services/auth')
const { updateUser } = require('../services/user')
const db = require('../models/index')
const User = db.Users

exports.fetch_self = async (req, res) => {
  try {
    const token = req.query.token
    console.log(token)
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    console.log(google)
    console.log(apple)
    const uid = google || apple
    const user = await User.findOne({
      where: {
        uid: uid
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

exports.updateUser = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    try {
      await updateUser(uid, req.body)
    } catch (err) {
      return res.status(400).send(err.message)
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
