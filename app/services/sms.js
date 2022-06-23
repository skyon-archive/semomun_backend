const crypto = require('crypto')
const axios = require('axios')
const {
  SMS_SERVICE_ID: serviceId,
  SMS_ACCESS_KEY: accessKey,
  SMS_SECRET_KEY: secretKey,
  PHONE_NUMBER: sendPhone
} = process.env

const createSignature = (timestamp) => {
  const url = `/sms/v2/services/${serviceId}/messages`
  const message = `POST ${url}\n${timestamp}\n${accessKey}`
  return crypto.createHmac('sha256', secretKey).update(message).digest('base64')
}

exports.sendSms = async (phone, message) => {
  const timestamp = Date.now().toString()
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': accessKey,
    'x-ncp-apigw-signature-v2': createSignature(timestamp)
  }

  const countryCode = phone.substring(1, 3)
  const parsedPhone = '0' + phone.substring(4).replaceAll('-', '')
  const form = {
    type: 'SMS',
    countryCode,
    from: sendPhone,
    content: message,
    messages: [
      {
        to: parsedPhone,
        content: message
      }
    ]
  }

  const { data } = await axios.post(url, form, { headers })
    .catch((e) => console.log(e))
  if (data.statusCode !== '202') throw new Error('failed to send sms')
}

exports.verifyPhoneFormat = (phone) => {
  return phone.match(/^\+\d{1,4}-\d{1,3}-\d{3,4}-\d{3,4}$/)
}
