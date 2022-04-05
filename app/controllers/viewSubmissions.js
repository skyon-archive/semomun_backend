const { ViewSubmissions } = require('../models/index')

exports.createViewSubmissions = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send(req.jwtMessage)

    const submissions = req.body
    submissions.forEach((submission) => { submission.uid = uid })

    await ViewSubmissions.bulkCreate(submissions)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
