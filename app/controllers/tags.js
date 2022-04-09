const { FavoriteTags, sequelize } = require('../models')
const { getTagsOrderBy, getTagsByUid } = require('../services/tags')
const { BadRequest } = require('../errors')

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
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    const result = await getTagsByUid(req.uid)
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

exports.updateMyTags = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    const prevTags = (await getTagsByUid(req.uid)).map(({ tid }) => tid)
    const newTags = req.body
    if (!Array.isArray(newTags)) throw new BadRequest('request body is not array')
    const toDelete = prevTags.filter((tag) => !newTags.includes(tag))
    const toCreate = newTags.filter((tag) => !prevTags.includes(tag))
    await sequelize.transaction(async (transaction) => {
      await FavoriteTags.destroy({
        where: { uid: req.uid, tid: toDelete },
        transaction
      })
      await FavoriteTags.bulkCreate(
        toCreate.map((tid) => ({ tid, uid: req.uid })),
        { transaction }
      )
    })
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
