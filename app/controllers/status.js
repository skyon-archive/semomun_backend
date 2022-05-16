const redis = require('../services/redis')

exports.checkIsReview = async (req, res) => {
  try {
    const reqVersion = req.query.version
    const reviewVersion = await redis.get('review:version')
    res.json({ result: reqVersion === reviewVersion })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
