const redis = require('../services/redis')
const { sendSms } = require('../services/sms')

exports.sendCode = async (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).send('PHONE_MISSING')

    const code = Math.floor(100000 + Math.random() * 900000)
    await redis.set(`code:${phone}`, code, { EX: 60 * 3 })
    await sendSms(phone, `세모문 인증번호입니다. [${code}]`)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.verifyCode = async (req, res) => {
  try {
    const { phone, code } = req.body
    if (!phone) return res.status(400).send('PHONE_MISSING')
    const redisCode = await redis.get(`code:${phone}`)
    if (code === redisCode) res.json({ result: 'ok' })
    else res.json({ result: 'fail' })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
