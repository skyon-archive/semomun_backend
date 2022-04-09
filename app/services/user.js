const { ValidationError } = require('sequelize')
const { BadRequest, Conflict } = require('../errors')
const { Users, UserInfo, sequelize } = require('../models/index')

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

exports.updateUser = async (uid, { username, ...userInfo }) => {
  const whiteList = [
    'name',
    'email',
    'birth',
    'phone',
    'major',
    'majorDetail',
    'address',
    'addressDetail',
    'school',
    'graduationStatus'
  ]
  Object.keys(userInfo).forEach((key) => {
    if (!whiteList.includes(key)) delete userInfo[key]
  })

  await sequelize.transaction(async (transaction) => {
    try {
      if (username) {
        const usernameUid = await getUserByUsername(username, transaction)
        if (usernameUid && usernameUid !== uid) {
          throw new Conflict('username not available')
        }
        await Users.update({ username }, { where: { uid }, transaction })
      }
      if (userInfo) {
        await UserInfo.update(userInfo, { where: { uid }, transaction })
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new BadRequest(err.message)
      } else throw err
    }
  })
}

exports.getUser = (uid) => {
  return Users.findOne({
    where: { uid },
    attributes: { exclude: ['googleId', 'appleId', 'role'] },
    raw: true
  })
}

exports.getUserWithInfo = async (uid) => {
  const { userInfo, ...user } = await Users.findOne({
    where: { uid },
    include: {
      association: 'userInfo',
      exclude: ['uid', 'createdAt', 'updatedAt']
    },
    attributes: { exclude: ['googleId', 'appleId', 'role', 'deleted'] },
    raw: true,
    nest: true
  })
  for (const key in userInfo) user[key] = userInfo[key]
  return user
}
