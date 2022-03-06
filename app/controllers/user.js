const { BadRequest } = require('../errors')
const { updateUser, getUser, getUserByUsername } = require('../services/user')

exports.fetchSelf = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    const user = await getUser(uid)
    if (!user) return res.status(404).send()
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.updateUser = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send()

    await updateUser(uid, req.body)
    res.json({})
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

exports.existByUsername = async (req, res) => {
  try {
    const { username } = req.query
    if (!username) throw new BadRequest()
    if (await getUserByUsername(username)) res.json({ result: false })
    else res.json({ result: true })
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
