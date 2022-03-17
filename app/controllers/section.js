const { getUserWithGoogle, getUserWithApple } = require('../services/auth')
const { Sections, Submissions } = require('../models/index')

exports.fetchSection = async (req, res) => {
  try {
    const sid = req.params.sid
    if (!sid) res.status(400)

    const section = await Sections.findOne({
      where: { sid },
      include: {
        association: 'views',
        order: [['views.index', 'ASC']],
        include: {
          association: 'problems',
          order: [['problems.index', 'ASC']]
        }
      }
    })
    if (!section) return res.status(404).send()
    res.json(section).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.createSubmission = async (req, res) => {
  try {
    const token = req.body.token
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    // const sid = req.params.sid
    // console.log(sid)
    const submissions = JSON.parse(req.body.submissions)
    for (const submission of submissions) {
      submission.uid = uid
      console.log(submission)
      await Submissions.create(submission)
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.updateSubmission = async (req, res) => {
  try {
    const token = req.body.token
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    // const sid = req.params.sid
    // console.log(sid)
    const submissions = JSON.parse(req.body.submissions)
    for (const submission of submissions) {
      await Submissions.update(submission, { where: { uid: uid, pid: submission.pid } })
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.fetchSubmission = async (req, res) => {
  try {
    const token = req.query.token
    const pid = req.params.pid
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    // const sid = req.params.sid
    // console.log(sid)
    const submission = await Submissions.findOne({ where: { uid: uid, pid: pid } })
    if (submission) {
      res.json({ check: true })
    } else {
      res.json({ check: false })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
