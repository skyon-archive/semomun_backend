const db = require('../models/index')
const { getUserWithGoogle, getUserWithApple } = require('./auth')
const View = db.Views
const Problem = db.Problems
const Submission = db.Submissions

exports.get = async (req, res) => {
  try {
    const sid = req.params.sid
    if (!sid) res.status(400)
    const views = await View.findAll({
      where: { sid },
      order: [
        ['index', 'ASC']
      ],
      include: [
        {
          model: Problem,
          as: 'problems',
          order: [
            ['index', 'ASC']
          ]
        }
      ],
      raw: true,
      nest: true
    })
    res.json(views)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.create_submission = async (req, res) => {
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
      await Submission.create(submission)
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.update_submission = async (req, res) => {
  try {
    const token = req.body.token
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    // const sid = req.params.sid
    // console.log(sid)
    const submissions = JSON.parse(req.body.submissions)
    for (const submission of submissions) {
      await Submission.update(submission, { where: { uid: uid, pid: submission.pid } })
    }
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.fetch_submission = async (req, res) => {
  try {
    const token = req.query.token
    const pid = req.params.pid
    const google = await getUserWithGoogle(token)
    const apple = await getUserWithApple(token)
    const uid = google || apple
    // const sid = req.params.sid
    // console.log(sid)
    const submission = await Submission.findOne({ where: { uid: uid, pid: pid } })
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
