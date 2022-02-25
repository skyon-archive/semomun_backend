const { createClient } = require('redis')
const { getUserWithGoogle, getUserWithApple, getGoogleId, getAppleId } = require('./auth')
const db = require('../models/index')
const request = require('request')
const crypto = require('crypto')
const env = process.env
const User = db.Users

function send_sms (phone, code) {
  const timestamp = new Date().getTime()
  const serviceId = env.SERVICE_ID
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`
  const hmac = crypto.createHmac('sha256', env.SECRET_KEY)
  const message = 'POST' + ' ' + url + '\n' + timestamp + '\n' + env.ACCESS_KEY
  hmac.write(message)
  hmac.end()
  const signature = hmac.read().toString('base64')
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': env.ACCESS_KEY,
    'x-ncp-apigw-signature-v2': signature
  }
  const form = {
    type: 'SMS',
    from: 'string',
    content: '세모문 인증번호입니다.',
    messages: [
      {
        to: phone,
        content: `[인증번호:${code}]`
      }
    ]
  }
  request.post({ url: url, form: form, headers: headers }, function (e, r, body) {
    if (body.statusName !== 'success') console.log(body)
  })
}

exports.send_code = async (req, res) => {
  try {
    const phone = req.params.phone
    const redis = createClient()
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()

    const code = Math.floor(100000 + Math.random() * 900000)
    send_sms(phone, code)
    await redis.setEx(`code:${phone}`, 300, code)
  } catch (err) {
    console.log(err)
    res.status(500).send('AUTHPHONE_SEND_FAILED')
  }
}

exports.check_code = async (req, res) => {
  try {
    const phone = req.body.phone
    const input = req.body.code
    const redis = createClient()
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()

    const code = await redis.get(`code:${phone}`)
    if (input === code) {
      res.json({})
    } else {
      res.status(400).send()
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.createUser = async (req, res) => {
  try {
    const token = req.body.token
    const userInfo = req.body.info
    const type = req.body.type

    if (type === 'google') {
      if (await getUserWithGoogle(token)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
      userInfo.googleId = await getGoogleId(token)
      if (!userInfo.googleId) {
        return res.status(400).send()
      }
    } else if (type === 'apple') {
      if (await getUserWithApple(token)) {
        return res.status(400).send('USER_ALREADY_EXISTS')
      }
      userInfo.appleId = await getAppleId(token)
      if (!userInfo.appleId) {
        return res.status(400).send()
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

    if (userInfo.uid) {
      return res.status(400).send()
    }
    userInfo.username = userInfo.nickname
    delete userInfo.nickName
    userInfo.name = ''
    userInfo.email = ''
    userInfo.gender = ''
    userInfo.auth = 1
    userInfo.credit = 0
    userInfo.favoriteTags = userInfo.favoriteTags.map((tid) => ({ tid }))

    let result
    try {
      result = await User.create(userInfo,
        { include: [{ association: User.FavoriteTags }] })
    } catch (err) {
      res.status(400).send(err.toString())
    }
    res.status(200).json({ uid: result.uid })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.check = async (req, res) => {
  try {
    const token = req.body.token
    if (await getUserWithGoogle(token) || await getUserWithApple(token)) {
      res.json({ check: true })
    } else {
      res.json({ check: false })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

async function getUserWithNickname (nickName) {
  try {
    const user = await User.findOne({ where: { nickName: nickName } })
    return user.uid
  } catch (err) {
    return null
  }
}

async function getUserWithPhone (phone) {
  try {
    const user = await User.findOne({ where: { phone: phone } })
    return user.uid
  } catch (err) {
    return null
  }
}
