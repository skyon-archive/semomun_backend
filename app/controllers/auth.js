const { getGoogleId, getAppleId } = require('../services/auth')
const { getUserWithGoogleId, getUserWithAppleId, getUserWithPhone, getUserWithNickname } = require('../services/user')
const { createUser } = require('../services/user')

exports.createUser = async (req, res) => {
  try {
    const token = req.body.token
    const userInfo = req.body.info
    const type = req.body.type

    if (type === 'google') {
      userInfo.googleId = await getGoogleId(token)
      if (!userInfo.googleId) {
        return res.status(400).send()
      }
      if (await getUserWithGoogleId(userInfo.googleId)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
    } else if (type === 'apple') {
      userInfo.appleId = await getAppleId(token)
      if (!userInfo.appleId) {
        return res.status(400).send()
      }
      if (await getUserWithAppleId(userInfo.appleId)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
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
