const { Submissions } = require('../models/index')

exports.createSubmissions = async (req, res) => {
  try {
    const uid = req.uid
    if (!uid) return res.status(401).send(req.jwtMessage)

    const { submissions } = req.body
    submissions.forEach((submission) => { submission.uid = uid })

    await Submissions.bulkCreate(submissions)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
