const { createClient } = require('redis')
const redisHost = process.env.REDIS_HOST ?? 'redis://redis:6379'

const redis = createClient({ url: redisHost })
redis.connect()

module.exports = redis
