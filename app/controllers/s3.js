const { sequelize } = require('../models/index')
const { getPresignedUrl } = require('../services/s3')
const { BadRequest, Forbidden } = require('../errors')

const checkPermissions = async (uuid, type, uid) => {
  const publicTypes = [FileType.BOOKCOVER, FileType.SECTIONCOVER]
  if (type === FileType.PASSAGE) {
    const sql = `SELECT * FROM Views
    JOIN Sections ON Views.sid = Sections.sid
    JOIN Workbooks ON Sections.wid = Workbooks.wid
    JOIN PayHistory ON Workbooks.id = PayHistory.id
    WHERE Views.passage = :uuid AND PayHistory.uid = :uid`
    const views = await sequelize.query(
      sql,
      { type: sequelize.QueryTypes.SELECT, replacements: { uid, uuid } }
    )
    if (views.length === 0) throw new Forbidden('')
  } else if (type === FileType.EXPLANATION) {
    const sql = `SELECT * FROM Problems
    JOIN Views ON Views.vid = Problems.vid
    JOIN Sections ON Views.sid = Sections.sid
    JOIN Workbooks ON Sections.wid = Workbooks.wid
    JOIN PayHistory ON Workbooks.id = PayHistory.id
    WHERE Problems.explanation = :uuid AND PayHistory.uid = :uid`
    const problems = await sequelize.query(
      sql,
      { type: sequelize.QueryTypes.SELECT, replacements: { uid, uuid } }
    )
    if (problems.length === 0) throw new Forbidden('')
  } else if (type === FileType.CONTENT) {
    const sql = `SELECT * FROM Problems
    JOIN Views ON Views.vid = Problems.vid
    JOIN Sections ON Views.sid = Sections.sid
    JOIN Workbooks ON Sections.wid = Workbooks.wid
    JOIN PayHistory ON Workbooks.id = PayHistory.id
    WHERE Problems.content = :uuid AND PayHistory.uid = :uid`
    const problems = await sequelize.query(
      sql,
      { type: sequelize.QueryTypes.SELECT, replacements: { uid, uuid } }
    )
    if (problems.length === 0) throw new Forbidden('')
  } else if (!publicTypes.includes(type)) {
    throw new BadRequest('type should be one of bookcover, sectioncover, passage, explanation or content')
  }
}

exports.getPresignedUrl = async (req, res) => {
  try {
    const { query: { uuid, type }, uid } = req
    if (!uuid) throw new BadRequest('uuid missing')
    if (!type) throw new BadRequest('type missing')

    await checkPermissions(uuid, type, uid)
    const result = await getPresignedUrl(type, uuid)
    res.send(result)
  } catch (err) {
    if (err instanceof BadRequest) res.status(400).send(err.message)
    else if (err instanceof Forbidden) res.status(403).send(err.message)
    else {
      console.log(err)
      res.status(500).send()
    }
  }
}

const FileType = {
  BOOKCOVER: 'bookcover',
  SECTIONCOVER: 'sectioncover',
  PASSAGE: 'passage',
  EXPLANATION: 'explanation',
  CONTENT: 'content'
}
