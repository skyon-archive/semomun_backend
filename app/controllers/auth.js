const bcrypt = require('bcrypt')
const {
  getGoogleId,
  getAppleId,
  getAuthJwtKey,
  createJwt,
  verifyJwt,
  AuthType
} = require('../services/auth')
const {
  getUserWithGoogleId,
  getUserWithAppleId,
  getUserWithPhone,
  getUserWithNickname,
  createUser
} = require('../services/user')
const redis = require('../services/redis')

exports.createUser = async (req, res) => {
  try {
    const { token, type, info: userInfo } = req.body

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
    const tokens = createJwt(result.uid)
    res.json(tokens)
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
      if (!googleId) return res.status(400).send()
      uid = await getUserWithGoogleId(googleId)
    } else if (type === AuthType.APPLE) {
      const appleId = await getAppleId(token)
      if (!appleId) return res.status(400).send()
      uid = await getUserWithAppleId(appleId)
    } else return res.status(400).send('WRONG_TYPE')

    if (!uid) return res.status(400).send('USER_NOT_EXIST')

    const tokens = await createJwt(uid)
    res.json(tokens)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.headers.refresh
    if (!refreshToken) return res.status(400).send()
    const { ok: refreshOk, result: refreshDecoded } = verifyJwt(refreshToken)
    if (!refreshOk || !refreshDecoded) return res.status(400).send()
    const redisKey = getAuthJwtKey(refreshToken)

    const authorization = req.headers.authorization
    const accessToken = authorization ? authorization.split('Bearer ')[1] : null
    if (!accessToken) {
      await redis.del(redisKey)
      return res.status(400).send()
    }

    const { ok: accessOk, result: accessDecoded } = verifyJwt(accessToken)
    if (accessOk || !accessDecoded) {
      await redis.del(redisKey)
      return res.status(400).send()
    }

    const redisValue = await redis.get(redisKey)
    await redis.del(redisKey)
    if (!redisValue || !await bcrypt.compare(accessToken, redisValue)) {
      return res.status(400).send()
    }

    const newTokens = await createJwt(accessDecoded.uid)
    res.json(newTokens)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
