const db = require('../models/index')
const User = db.Users

exports.getUserWithNickname = async (nickName) => {
  try {
    const user = await User.findOne({ where: { nickName: nickName } })
    return user.uid
  } catch (err) {
    return null
  }
}

exports.getUserWithPhone = async (phone) => {
  try {
    const user = await User.findOne({ where: { phone: phone } })
    return user.uid
  } catch (err) {
    return null
  }
}

exports.getUserWithGoogleId = async (googleId) => {
  const user = await User.findOne({ where: { googleId } })
  if (user) return user.uid
  return null
}

exports.getUserWithAppleId = async (appleId) => {
  const user = await User.findOne({ where: { appleId } })
  if (user) return user.uid
  return null
}

exports.createUser = async (userInfo) => {
  const whiteList = [
    'nickname',
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
  userInfo.username = userInfo.nickname
  delete userInfo.nickname
  userInfo.name = ''
  userInfo.email = ''
  userInfo.gender = ''
  userInfo.auth = 1
  userInfo.credit = 0
  userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

  return await User.create(userInfo,
    { include: [{ association: User.FavoriteTags }] })
}

exports.updateUser = async (uid, userInfo) => {
  const whiteList = [
    'nickname',
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
  userInfo.username = userInfo.nickname
  delete userInfo.nickname

  const target = await User.findByPk(uid)
  if (!target) throw new Error('wrong uid')

  await User.update(userInfo, { where: { uid } })
}
