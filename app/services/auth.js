const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const db = require('../models/index')
const env = process.env
const client_id = env.CLIENT_ID
const client = new OAuth2Client(client_id)
const User = db.Users

const getGoogleId = async (token) => {
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

const getUserWithGoogle = async (token) => {
  try {
    const sub = getGoogleId(token)
    const user = await User.findOne({ where: { googleId: sub } })
    return user.uid
  } catch (err) {
    return null
  }
}

const getAppleId = async (token) => {
  try {
    const sub = jwt.decode(token).sub
    return sub
  } catch (err) {
    return null
  }
}

const getUserWithApple = async (token) => {
  try {
    const sub = getAppleId(token)
    const user = await User.findOne({ where: { appleId: sub } })
    if (user === null) {
      return null
    } else {
      return user.uid
    }
  } catch (err) {
    return null
  }
}

exports.getGoogleId = getGoogleId
exports.getUserWithGoogle = getUserWithGoogle
exports.getAppleId = getAppleId
exports.getUserWithApple = getUserWithApple
