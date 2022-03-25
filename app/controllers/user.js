const { BadRequest } = require('../errors')
const { Users } = require('../models/index')
const { updateUser, getUser, getUserByUsername } = require('../services/user')
const { getGoogleIdLegacy } = require('../services/auth')

exports.fetchSelf = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    const user = await getUser(uid)
    if (!user) return res.status(404).send()
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.updateUser = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    await updateUser(uid, req.body)
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

exports.existByUsername = async (req, res) => {
  try {
    const { username } = req.query
    if (!username) throw new BadRequest()
    if (await getUserByUsername(username)) res.json({ result: false })
    else res.json({ result: true })
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

exports.migrate = async (req, res) => {
  try {
    const {
      nickName,
      school,
      major,
      majorDetail,
      graduationStatus,
      socialId
    } = req.body

    const userInfo = {
      username: nickName,
      name: '',
      email: '',
      gender: '',
      phone: '',
      credit: 0,
      auth: 1,
      major,
      majorDetail,
      school,
      graduationStatus
    }

    const googleId = await getGoogleIdLegacy(socialId)
    if (googleId) userInfo.googleId = googleId
    else {
      if (socialId.includes('.')) userInfo.appleId = socialId
      else userInfo.googleId = socialId
    }

    await Users.create(userInfo)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
