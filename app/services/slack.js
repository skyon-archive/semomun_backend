const axios = require('axios')
const { SLACK_CHANNEL, SLACK_TOKEN } = process.env

exports.sendSlackMessage = (message) => axios.post(
  'https://slack.com/api/chat.postMessage',
  {
    channel: SLACK_CHANNEL,
    text: message
  },
  {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` }
  }
)
