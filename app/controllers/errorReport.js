const { ErrorReports } = require('../models/index')
const { sendSlackMessage } = require('../services/slack')

exports.createErrorReport = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    const { pid, content } = req.body
    const { erid } = await ErrorReports.create({ pid, content, uid: req.uid })
    await sendSlackMessage(`-- erid ${erid}, uid ${req.uid} --\n${content}`)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
