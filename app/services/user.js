const { ValidationError } = require('sequelize')
const { BadRequest, Conflict } = require('../errors')
const { Users, sequelize } = require('../models/index')

const getUserByUsername = async (username, transaction = undefined) => {
  const user = await Users.findOne({ where: { username }, transaction })
  return user ? user.uid : null
}
exports.getUserByUsername = getUserByUsername

const getUserWithGoogleId = async (googleId, transaction = undefined) => {
  const user = await Users.findOne({ where: { googleId }, transaction })
  return user ? user.uid : null
}
exports.getUserWithGoogleId = getUserWithGoogleId

const getUserWithAppleId = async (appleId, transaction = undefined) => {
  const user = await Users.findOne({ where: { appleId }, transaction })
  return user ? user.uid : null
}
exports.getUserWithAppleId = getUserWithAppleId

exports.createUser = async (userInfo) => {
  const whiteList = [
    'username',
    'phone',
    'school',
    'major',
    'majorDetail',
    'favoriteTags',
    'graduationStatus',
    'googleId',
    'appleId'
  ]
  Object.keys(userInfo).forEach(key => {
    if (!whiteList.includes(key)) {
      throw new BadRequest(`${key} is not a valid key`)
    }
  })

  if (!userInfo.googleId && !userInfo.appleId) {
    throw new BadRequest('googleId and appleId missing')
  }

  return await sequelize.transaction(async (t) => {
    if (userInfo.googleId && await getUserWithGoogleId(userInfo.googleId, t)) {
      throw new BadRequest('USER_ALREADY_EXISTS')
    }
    if (userInfo.appleId && await getUserWithAppleId(userInfo.appleId, t)) {
      throw new BadRequest('USER_ALREADY_EXISTS')
    }
    if (await getUserByUsername(userInfo.username, t)) {
      throw new Conflict('USERNAME_NOT_AVAILABLE')
    }

    userInfo.name = ''
    userInfo.email = ''
    userInfo.gender = ''
    userInfo.auth = 1
    userInfo.credit = 0
    userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

    try {
      return await Users.create(userInfo,
        { include: [{ association: Users.FavoriteTags }] })
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new BadRequest(err.message)
      } else throw err
    }
  })
}

exports.updateUser = async (uid, userInfo) => {
  const whiteList = [
    'username',
    'name',
    'email',
    'gender',
    'birth',
    'phone',
    'major',
    'majorDetail',
    'school',
    'graduationStatus'
  ]
  Object.keys(userInfo).forEach((key) => {
    if (!whiteList.includes(key)) delete userInfo[key]
  })

  await sequelize.transaction(async (transaction) => {
    const target = await Users.findByPk(uid, { transaction })
    if (!target) throw new BadRequest('WRONG_UID')

    try {
      await Users.update(userInfo, { where: { uid } })
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new BadRequest(err.message)
      } else throw err
    }
  })
}

exports.getUser = async (uid) => {
  const user = await Users.findOne({
    where: { uid },
    attributes: { exclude: ['googleId', 'appleId', 'auth'] },
    raw: true
  })
  return user
}
