const redis = require('../services/redis')

exports.getBanners = async (req, res) => {
  try {
    const list = await redis.lRange('banner:list', 0, -1)
    const result = await Promise.all(list.map(async (item) => {
      const r = await redis.hGetAll(`banner:item:${item}`)
      return { image: r.image, url: r.url }
    }))
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
