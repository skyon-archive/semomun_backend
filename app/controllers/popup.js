const redis = require('../services/redis')

exports.getPopup = async (req, res) => {
  try {
    const result = await redis.get('popup:image')
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
