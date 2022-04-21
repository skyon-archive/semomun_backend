const { BadRequest, Conflict } = require('../errors')
const { Users } = require('../models/index')
const { updateUser, getUserWithInfo, getUserByUsername } = require('../services/user')
const { getGoogleIdLegacy } = require('../services/auth')

exports.fetchSelf = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send(req.jwtMessage)

    const user = await getUserWithInfo(uid)
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
    if (!uid) return res.status(401).send(req.jwtMessage)

    await updateUser(uid, req.body)
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof Conflict) res.status(409).send(err.message)
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
      name: '',
      email: '',
      phone: '',
      address: '',
      addressDetail: '',
      major,
      majorDetail,
      school,
      graduationStatus,
      marketing: 0
    }

    const googleId = getGoogleIdLegacy(socialId)
    if (googleId) userInfo.googleId = googleId
    else {
      if (socialId.includes('.')) userInfo.appleId = socialId
      else userInfo.googleId = socialId
    }

    await Users.create({
      username: nickName,
      credit: 0,
      role: 'USER',
      deleted: 0,
      userInfo
    }, { include: ['userInfo'] }
    )
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.withdraw = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    await Users.update({ deleted: 1 }, { where: { uid: req.uid } })
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
