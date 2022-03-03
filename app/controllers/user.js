const { CustomError } = require('../errors')
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

    await updateUser(uid, req.body)
    res.json({})
  } catch (err) {
    if (err instanceof CustomError) res.status(400).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}
