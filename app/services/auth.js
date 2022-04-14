const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const jwksClient = require('jwks-rsa')({ jwksUri: 'https://appleid.apple.com/auth/keys' })
const env = process.env
const googleClientId = [env.GOOGLE_CLIENT_ID_APP, env.GOOGLE_CLIENT_ID_WEB]
const appleClientId = [env.APPLE_CLIENT_ID_APP, env.APPLE_CLIENT_ID_WEB]
const jwtSecret = env.JWT_SECRET
const salt = env.SALT
const client = new OAuth2Client(googleClientId)
const redis = require('./redis')

exports.getGoogleId = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId
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
    const { sub } = jwt.verify(
      token,
      { audience: googleClientId, ignoreExpiration: true }
    )
    return sub
  } catch (err) {
    return null
  }
}

const getAppleSigningKey = (kid) => {
  return new Promise((resolve, reject) => {
    jwksClient.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err)
      } else {
        resolve(key)
      }
    })
  })
}

exports.getAppleId = async (token, ignoreExpiration = false) => {
  try {
    const { kid, alg } = jwt.decode(token, { complete: true }).header
    const key = await getAppleSigningKey(kid)
    const { sub } = jwt.verify(token, key.getPublicKey(), {
      issuer: 'https://appleid.apple.com',
      audience: appleClientId,
      algorithms: [alg],
      ignoreExpiration
    })
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
  const accessToken = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: '10m' })
  const refreshToken = jwt.sign({}, jwtSecret, { algorithm: 'HS256', expiresIn: short ? '3h' : '30d' })
  const accessHash = bcrypt.hashSync(accessToken, +salt)
  const redisKey = getAuthJwtKey(refreshToken)
  await redis.set(redisKey, accessHash, { EX: 60 * 60 * 24 * 30 + 15 })
  console.log(redisKey, await redis.get(redisKey))
  return { accessToken, refreshToken }
}

exports.verifyJwt = (token, secret = jwtSecret) => {
  try {
    const result = jwt.verify(token, jwtSecret)
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
