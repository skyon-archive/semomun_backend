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
  const form = {
    type: 'SMS',
    countryCode: '82',
    from: sendPhone,
    content: message,
    messages: [
      {
        to: phone,
        content: message
      }
    ]
  }
  await axios.post(url, form, { headers }).catch((e) => console.log(e.message))
}
