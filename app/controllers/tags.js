const { FavoriteTags } = require('../models/index')
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

exports.getMyTags = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send()
    const result = await FavoriteTags.findAll({
      where: { uid: req.uid },
      include: 'tid_Tag',
      order: [['createdAt', 'ASC']]
    })
    res.json(result.map(({ tid_Tag, createdAt }) => ({
      tid: tid_Tag.tid,
      name: tid_Tag.name,
      createdAt
    })))
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
