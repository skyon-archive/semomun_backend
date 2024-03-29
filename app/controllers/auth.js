const bcrypt = require('bcrypt')
const {
  getGoogleId,
  getGoogleIdLegacy,
  getAppleId,
  getAuthJwtKey,
  createJwt,
  verifyJwt,
  AuthType
} = require('../services/auth')
const {
  getUserWithGoogleId,
  getUserWithAppleId,
  createUser
} = require('../services/user')
const redis = require('../services/redis')
const { BadRequest, Conflict } = require('../errors')

exports.createUser = async (req, res) => {
  try {
    const { token, type, info: userInfo } = req.body
    const { expire } = req.query

    if (type === AuthType.GOOGLE) {
      userInfo.googleId = await getGoogleId(token)
      if (!userInfo.googleId) return res.status(400).send('INVALID_TOKEN')
    } else if (type === AuthType.APPLE) {
      userInfo.appleId = await getAppleId(token)
      if (!userInfo.appleId) return res.status(400).send('INVALID_TOKEN')
    } else {
      return res.status(400).send('WRONG_TYPE')
    }

    const result = await createUser(userInfo)

    const tokens = await createJwt(result.uid, expire === 'short')
    res.json(tokens)
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof Conflict) res.status(409).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

exports.login = async (req, res) => {
  try {
    const { token, type } = req.body
    const { expire } = req.query

    let uid
    if (type === AuthType.GOOGLE) {
      const googleId = await getGoogleId(token)
      if (!googleId) return res.status(400).send()
      uid = await getUserWithGoogleId(googleId)
    } else if (type === AuthType.APPLE) {
      const appleId = await getAppleId(token)
      if (!appleId) return res.status(400).send()
      uid = await getUserWithAppleId(appleId)
    } else if (type === AuthType.LEGACY) {
      const googleId = getGoogleIdLegacy(token, true)
      if (googleId) uid = await getUserWithGoogleId(googleId)
      else {
        const appleId = await getAppleId(token)
        if (!appleId) return res.status(400).send()
        uid = await getUserWithAppleId(appleId)
      }
    } else if (type === AuthType.REVIEW) {
      const correctPassword = await redis.get('review:password')
      if (token === correctPassword) uid = +(await redis.get('review:uid'))
      else return res.status(400).send('WRONG_PASSWORD')
    } else return res.status(400).send('WRONG_TYPE')

    if (!uid) return res.status(400).send('USER_NOT_EXIST')

    const tokens = await createJwt(uid, expire === 'short')
    res.json(tokens)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.headers.refresh
    if (!refreshToken) throw new BadRequest('refresh token missing')
    const { ok: refreshOk, result: refreshDecoded } = verifyJwt(refreshToken)
    console.log(refreshOk, refreshDecoded)
    if (!refreshOk) throw new BadRequest('refresh token expired')
    if (!refreshDecoded) throw new BadRequest('failed to decode refresh token')
    const redisKey = getAuthJwtKey(refreshToken)

    const authorization = req.headers.authorization
    const accessToken = authorization ? authorization.split('Bearer ')[1] : null
    console.log(accessToken, refreshToken)
    if (!accessToken) {
      await redis.del(redisKey)
      throw new BadRequest('access token missing')
    }

    const { message: accessMessage, result: accessDecoded } = verifyJwt(accessToken)
    console.log(accessMessage, accessDecoded)
    if (accessMessage !== 'jwt expired') {
      await redis.del(redisKey)
      throw new BadRequest('access token not expired')
    }
    if (!accessDecoded) {
      await redis.del(redisKey)
      throw new BadRequest('failed to decode access token')
    }

    const redisValue = await redis.get(redisKey)
    await redis.del(redisKey)
    console.log(redisKey, redisValue)
    if (!redisValue || !await bcrypt.compare(accessToken, redisValue)) {
      throw new BadRequest('access token and refresh token not match')
    }

    const { expire } = req.query

    const newTokens = await createJwt(accessDecoded.uid, expire === 'short')
    res.json(newTokens)
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
