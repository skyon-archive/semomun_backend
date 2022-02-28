const { updateUser, getUser } = require('../services/user')

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

    try {
      await updateUser(uid, req.body)
    } catch (err) {
      return res.status(400).send(err.message)
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
