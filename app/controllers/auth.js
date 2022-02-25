const {
  getGoogleId,
  getAppleId,
  createJWT,
  AuthType
} = require('../services/auth')
const {
  getUserWithGoogleId,
  getUserWithAppleId,
  getUserWithPhone,
  getUserWithNickname,
  createUser
} = require('../services/user')

exports.createUser = async (req, res) => {
  try {
    const { token, type, userInfo } = req.body

    if (type === AuthType.GOOGLE) {
      userInfo.googleId = await getGoogleId(token)
      if (!userInfo.googleId) {
        return res.status(400).send()
      }
      if (await getUserWithGoogleId(userInfo.googleId)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
    } else if (type === AuthType.APPLE) {
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
    const tokens = createJWT(result.uid)
    res.status(200).json(tokens)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.login = async (req, res) => {
  try {
    const { token, type } = req.body

    let uid
    if (type === AuthType.GOOGLE) {
      const googleId = await getGoogleId(token)
      if (!googleId) return res.send(400)
      uid = await getUserWithGoogleId(googleId)
    } else if (type === AuthType.APPLE) {
      const appleId = await getAppleId(token)
      if (!appleId) return res.send(400)
      uid = await getUserWithAppleId(appleId)
    } else return res.status(400).send('WRONG_TYPE')

    if (!uid) res.status(400).send('USER_NOT_EXIST')

    const tokens = createJWT(uid)
    res.status(200).json(tokens)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
