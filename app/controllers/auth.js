const { getUserWithGoogle, getUserWithApple, getGoogleId, getAppleId } = require('../services/auth')
const { getUserWithPhone, getUserWithNickname } = require('./user')
const { createUser } = require('../services/user')

exports.createUser = async (req, res) => {
  try {
    const token = req.body.token
    const userInfo = req.body.info
    const type = req.body.type

    if (type === 'google') {
      if (await getUserWithGoogle(token)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
      userInfo.googleId = await getGoogleId(token)
      if (!userInfo.googleId) {
        return res.status(400).send()
      }
    } else if (type === 'apple') {
      if (await getUserWithApple(token)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
      userInfo.appleId = await getAppleId(token)
      if (!userInfo.appleId) {
        return res.status(400).send()
      }
    } else {
      return res.status(400).send('WRONG_TYPE')
    }

    if (await getUserWithNickname(userInfo.nickname)) {
      return res.status(409).send('NICKNAME_NOT_AVAILABLE')
    }
    if (await getUserWithPhone(userInfo.phone)) {
      return res.status(409).send('PHONE_NOT_AVAILABLE')
    }

    let result
    try {
      result = await createUser(userInfo)
    } catch (err) {
      res.status(400).send(err.toString())
    }
    res.status(200).json({ uid: result.uid })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
