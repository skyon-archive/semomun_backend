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
  if (userInfo.uid) {
    throw new Error('uid should be null')
  }
  userInfo.username = userInfo.nickname
  delete userInfo.nickName
  userInfo.name = ''
  userInfo.email = ''
  userInfo.gender = ''
  userInfo.auth = 1
  userInfo.credit = 0
  userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

  return await User.create(userInfo,
    { include: [{ association: User.FavoriteTags }] })
}
