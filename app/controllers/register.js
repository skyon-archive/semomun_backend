const { createClient } = require('redis')
const { getUserWithGoogle, getUserWithApple } = require('../services/auth')
const request = require('request')
const crypto = require('crypto')
const env = process.env

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
