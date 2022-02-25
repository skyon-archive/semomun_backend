const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const env = process.env
const client_id = env.CLIENT_ID
const client = new OAuth2Client(client_id)

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

const getAppleId = async (token) => {
  try {
    const sub = jwt.decode(token).sub
    return sub
  } catch (err) {
    return null
  }
}

exports.getGoogleId = getGoogleId
exports.getAppleId = getAppleId
