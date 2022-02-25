const { OAuth2Client } = require('google-auth-library')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const env = process.env
const client_id = env.CLIENT_ID
const client = new OAuth2Client(client_id)
const User = db.Users

exports.getUserWithGoogle = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id
    })
    const payload = ticket.getPayload()
    const sub = payload.sub
    const user = await User.findOne({ where: { googleId: sub } })
    return user.uid
  } catch (err) {
    return null
  }
}

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

exports.getUserWithApple = async (token) => {
  try {
    const sub = jwt.decode(token).sub
    console.log('ap' + sub)
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

exports.getAppleId = async (token) => {
  try {
    const sub = jwt.decode(token).sub
    console.log('get' + sub)
    return sub
  } catch (err) {
    return null
  }
}
