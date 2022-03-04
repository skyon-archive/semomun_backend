const { getTagsOrderBy } = require('../services/tags')

exports.getTags = async (req, res) => {
  try {
    const { order } = req.query
    const result = await getTagsOrderBy(order)
    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
