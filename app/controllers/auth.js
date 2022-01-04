const { OAuth2Client } = require('google-auth-library')
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const env = process.env
const client_id = env.CLIENT_ID
const client = new OAuth2Client(client_id)
const User = db.users

exports.get_user_with_google = async (token) => {
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

exports.get_user_with_apple = async (token) => {
  try {
    const idToken = jwt.decode(token)
    const sub = idToken.sub
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
