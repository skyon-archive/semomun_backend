/*
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const db = require('../models/index')
const User = db.users

require('dotenv').config('../../.env')
CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)
*/

/*
const path = require('path')
const AppleAuth = require('apple-auth')
const appleConfig = require('../config/apple.json')
const auth = new AppleAuth(appleConfig, path.join(__dirname, `../config/${appleConfig.private_key_path}`))
*/
/*
exports.url = async (req, res) => {
  res.status(200).json({ url: jwt.decode('eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLnNlbW9tdW4uYXV0aGVudGljYXRlIiwiZXhwIjoxNjQxMDUzNDQ4LCJpYXQiOjE2NDA5NjcwNDgsInN1YiI6IjAwMTc2My5hMDcxYjg0NDdlYzI0OTUyODljMzZlNjUxZTAwYTZjYy4wNzMxIiwiY19oYXNoIjoiR19zRjdPYTQ5Z2JsbUFNOGp5MFNqUSIsImVtYWlsIjoidHp3cHBjcWJ4ZkBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY0MDk2NzA0OCwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.YXUQqjKX3k_HWdCypye1WDcarq2wAWxpOVUtgu4YlHJDA0yHemX-g8iQogI65zEw7bfuB78WG5iHQJq5bWGGbhR1mXK5EItnq4l-Rt99mLxmldkfzRJLs1BEVuT5dh6DHCStQNDZYZYAOS_U8Lvutfcs2DpJ8ryWt2HOWNb2cazNOiwsRt78Yz79pM-antnuTLalK5ikoVmGqwDBug1rZ12iwaUZbDTZZZtiTcdk0eFY_KvmrPvcTfTGZ7r1tbS27TJ_m33phqSvQtcqoLXF2AKYKwjSQ161sXAuH_Ln2eP5QvxY2VghrLe4qjF9D7fNlEOD-VZEbQHTtIWUP-cVPw') })
}
*/

/*
exports.login = async (req, res) => {
  try {
    const token_google = req.body.token_google
    const token_apple = req.body.token_apple
    let uid = 0
    if (token_google) {
      uid = await get_user_with_google(token_google)
    }
    if (token_apple) {
      uid = await get_user_with_apple(token_apple)
    }
    res.status(200).json({ uid: uid })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while authentication.'
    })
  }
}

async function get_user_with_google (token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  })
  const payload = ticket.getPayload()
  const sub = payload.sub
  const user = await User.findOne({ where: { googleId: sub } })
  if (user === null) {
    return null
  } else {
    return user.uid
  }
}

async function get_user_with_apple (token) {
  const idToken = jwt.decode(token)
  const sub = idToken.sub
  const user = await User.findOne({ where: { appleId: sub } })
  if (user === null) {
    return null
  } else {
    return user.uid
  }
}
*/
