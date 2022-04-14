const { ErrorReports } = require('../models/index')
const { sendSlackMessage } = require('../services/slack')
const { fetchProblemByPid } = require('../services/problem')

exports.createErrorReport = async (req, res) => {
  try {
    if (!req.uid) return res.status(401).send(req.jwtMessage)
    const { pid, content } = req.body
    const { erid } = await ErrorReports.create({ pid, content, uid: req.uid })
    const problem = await fetchProblemByPid(pid)
    await sendSlackMessage(`-- erid ${erid}, ${problem.View.Section.Workbook.title} --\n${content}`)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
