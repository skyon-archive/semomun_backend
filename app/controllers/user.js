const { getUserWithGoogle, getUserWithApple } = require('../services/auth')
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

/*
exports.fetch_user = async (req, res) => {
  try {
    const target = req.params.uid
    const token = req.body.token
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    if (uid !== target) {
      res.status(403).send()
    }
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
*/

exports.update_user = async (req, res) => {
  try {
    const target = await User.findOne({ where: { nickName: req.params.nickname } })
    if (target === null) { return res.status(404).send() }

    const token = req.body.token
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    if (uid !== target.uid) {
      return res.status(403).send()
    }
    const userInfo = JSON.parse(req.body.info)
    const whitelist = ['gender', 'school', 'major', 'majorDetail', 'favoriteCategory', 'graduationStatus', 'birthday']
    if (Object.keys(userInfo).some(r => whitelist.includes(r)) === false) {
      return res.status(400).send()
    }

    await User.update(userInfo, { where: { uid: uid } })
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
