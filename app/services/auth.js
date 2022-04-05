const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = process.env
const clientId = [env.CLIENT_ID_APP, env.CLIENT_ID_WEB]
const secret = env.JWT_SECRET
const salt = env.SALT
const client = new OAuth2Client(clientId)
const redis = require('./redis')

exports.getGoogleId = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    })
    const payload = ticket.getPayload()
    const sub = payload.sub
    return sub
  } catch (err) {
    return null
  }
}

exports.getGoogleIdLegacy = async (token) => {
  try {
    const { aud, sub } = jwt.decode(token)
    return clientId.includes(aud) ? sub : null
  } catch (err) {
    return null
  }
}

exports.getAppleId = async (token) => {
  try {
    const sub = jwt.decode(token).sub
    return sub
  } catch (err) {
    return null
  }
}

const getAuthJwtKey = (refreshToken) => {
  return `auth:jwt:${refreshToken}`
}
exports.getAuthJwtKey = getAuthJwtKey

exports.createJwt = async (uid, short = false) => {
  const payload = { uid }
  const accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '10m' })
  const refreshToken = jwt.sign({}, secret, { algorithm: 'HS256', expiresIn: short ? '3h' : '30d' })
  const accessHash = bcrypt.hashSync(accessToken, +salt)
  const redisKey = getAuthJwtKey(refreshToken)
  await redis.set(redisKey, accessHash, { EX: 60 * 60 * 24 * 30 + 15 })
  console.log(redisKey, await redis.get(redisKey))
  return { accessToken, refreshToken }
}

exports.verifyJwt = (token) => {
  try {
    const result = jwt.verify(token, secret)
    return { ok: true, result }
  } catch (e) {
    try {
      const result = jwt.verify(token, secret, { ignoreExpiration: true })
      return { ok: false, result, message: e.message }
    } catch {
      return { ok: false, result: null, message: e.message }
    }
  }
}

exports.AuthType = ({
  GOOGLE: 'google',
  APPLE: 'apple',
  LEGACY: 'legacy'
})
