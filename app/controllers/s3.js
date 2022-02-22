const { S3 } = require('aws-sdk')

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

exports.get_presignedUrl = async (req, res) => {
  try {
    const key = req.query.key
    if (!key) res.status(400)
    const params = { Bucket: process.env.S3_BUCKET, Key: `${key}.png`, Expires: 3600 }
    const result = await s3.getSignedUrlPromise('getObject', params)
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
