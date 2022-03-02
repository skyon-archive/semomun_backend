const { Users } = require('../models/index')

exports.getUserWithNickname = async (nickname) => {
  try {
    const user = await Users.findOne({ where: { username: nickname } })
    return user.uid
  } catch (err) {
    return null
  }
}

exports.getUserWithPhone = async (phone) => {
  try {
    const user = await Users.findOne({ where: { phone: phone } })
    return user.uid
  } catch (err) {
    return null
  }
}

exports.getUserWithGoogleId = async (googleId) => {
  const user = await Users.findOne({ where: { googleId } })
  if (user) return user.uid
  return null
}

exports.getUserWithAppleId = async (appleId) => {
  const user = await Users.findOne({ where: { appleId } })
  if (user) return user.uid
  return null
}

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
    if (!whiteList.includes(key)) throw new Error(`${key} is not a valid key`)
  })
  userInfo.name = ''
  userInfo.email = ''
  userInfo.gender = ''
  userInfo.auth = 1
  userInfo.credit = 0
  userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

  return await Users.create(userInfo,
    { include: [{ association: Users.FavoriteTags }] })
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
