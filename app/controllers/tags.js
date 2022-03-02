const { getTagsOrderByPopularity } = require('../services/tags')

exports.getTags = async (req, res) => {
  try {
    const { page, limit } = req.query
    const result = await getTagsOrderByPopularity(
      +page ? +page : 1,
      +limit ? +limit : 25
    )
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
