const { Users, sequelize } = require('../models/index')

const getUserWithUsername = async (username, transaction = undefined) => {
  try {
    const user = await Users.findOne({ where: { username }, transaction })
    return user.uid
  } catch (err) {
    return null
  }
}
exports.getUserWithUsername = getUserWithUsername

const getUserWithPhone = async (phone, transaction = undefined) => {
  try {
    const user = await Users.findOne({ where: { phone: phone }, transaction })
    return user.uid
  } catch (err) {
    return null
  }
}
exports.getUserWithPhone = getUserWithPhone

const getUserWithGoogleId = async (googleId, transaction = undefined) => {
  const user = await Users.findOne({ where: { googleId } })
  if (user) return user.uid
  return null
}
exports.getUserWithGoogleId = getUserWithGoogleId

const getUserWithAppleId = async (appleId, transaction = undefined) => {
  const user = await Users.findOne({ where: { appleId }, transaction })
  if (user) return user.uid
  return null
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
      return new Error(`${key} is not a valid key`)
    }
  })

  if (!userInfo.googleId && !userInfo.appleId) {
    return new Error('googleId and appleId missing')
  }

  return await sequelize.transaction(async (t) => {
    if (userInfo.googleId && await getUserWithGoogleId(userInfo.googleId, t)) {
      return new Error('USER_ALREADY_EXISTS')
    }
    if (userInfo.appleId && await getUserWithAppleId(userInfo.appleId, t)) {
      return new Error('USER_ALREADY_EXISTS')
    }
    if (await getUserWithUsername(userInfo.username, t)) {
      return new Error('USERNAME_NOT_AVAILABLE')
    }
    if (await getUserWithPhone(userInfo.phone, t)) {
      return new Error('PHONE_NOT_AVAILABLE')
    }

    userInfo.name = ''
    userInfo.email = ''
    userInfo.gender = ''
    userInfo.auth = 1
    userInfo.credit = 0
    userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

    return await Users.create(userInfo,
      { include: [{ association: Users.FavoriteTags }] })
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

  const target = await Users.findByPk(uid)
  if (!target) throw new Error('wrong user')

  await Users.update(userInfo, { where: { uid } })
}

exports.getUser = async (uid) => {
  const user = await Users.findOne({
    where: { uid },
    attributes: { exclude: ['googleId', 'appleId', 'auth'] },
    raw: true
  })
  return user
}
