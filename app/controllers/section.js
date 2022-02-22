const db = require('../models/index')
const { get_user_with_google, get_user_with_apple } = require('./auth')
const View = db.Views
const Problem = db.Problems
const Submission = db.Submissions
const Op = db.Sequelize.Op

exports.get = async (req, res) => {
  try {
    const views = await View.findAll({
      where: {
        sid: req.params.sid
      },
      order: [
        ['index_start', 'ASC']
      ],
      raw: true
    })
    await Promise.all(
      views.map(async (view) => {
        view.problems = await Problem.findAll({
          where: {
            sid: req.params.sid,
            icon_index: {
              [Op.between]: [view.index_start, view.index_end]
            }
          },
          order: [
            ['icon_index', 'ASC']
          ],
          raw: true
        })
      })
    )
    res.json(views)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.create_submission = async (req, res) => {
  try {
    const token = req.body.token
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
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
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
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
    const google = await get_user_with_google(token)
    const apple = await get_user_with_apple(token)
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
