const { S3 } = require('aws-sdk')
const { sequelize } = require('../models/index')
const { BadRequest, Forbidden } = require('../errors')

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

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
    const key = `${type}/${uuid}.png`
    const params = { Bucket: process.env.S3_BUCKET, Key: key, Expires: 3600 }
    const result = await s3.getSignedUrlPromise('getObject', params)
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
