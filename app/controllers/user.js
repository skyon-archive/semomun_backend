const { get_user_with_google, get_user_with_apple } = require('./auth')
const db = require('../models/index')
const User = db.users

exports.fetch_self = async (req, res) => {
  try {
    const token = req.body.token
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
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
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
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
    const target = req.params.uid
    const token = req.body.token
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
    const uid = google || apple
    if (uid !== target) {
      res.status(403).send()
    }
    if (await User.findByPk(uid) === null) { res.status(404).send() }

    const userInfo = JSON.parse(req.body.info)
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
