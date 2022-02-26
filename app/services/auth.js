const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const env = process.env
const client_id = env.CLIENT_ID
const secret = env.JWT_SECRET
const salt = env.SALT
const client = new OAuth2Client(client_id)
const redis = require('./redis')

exports.getGoogleId = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id
    })
    const payload = ticket.getPayload()
    const sub = payload.sub
    return sub
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

exports.createJwt = async (uid) => {
  const payload = { uid }
  const accessToken = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m' })
  const refreshToken = jwt.sign({}, secret, { algorithm: 'HS256', expiresIn: '30d' })
  const accessHash = bcrypt.hashSync(accessToken, +salt)
  await redis.set(getAuthJwtKey(refreshToken), accessHash, { EX: 60 * 60 * 24 * 30 + 15 })
  return { accessToken, refreshToken }
}

exports.verifyJwt = (token) => {
  try {
    const result = jwt.verify(token, secret)
    return { ok: true, result }
  } catch (e) {
    try {
      const result = jwt.decode(token, secret)
      return { ok: false, result, message: e.message }
    } catch {
      return { ok: false, result: null, message: e.message }
    }
  }
}

exports.AuthType = ({
  GOOGLE: 'google',
  APPLE: 'apple'
})
