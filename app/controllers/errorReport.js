const { ErrorReports } = require('../models/index')

exports.createErrorReport = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    const { pid, content } = req.body
    await ErrorReports.create({ pid, content, uid: req.uid })
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
