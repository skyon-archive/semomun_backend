const { S3 } = require('aws-sdk')

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

exports.get_presignedUrl = async (req, res) => {
  try {
    const uuid = req.query.uuid
    const type = req.query.type
    if (!uuid) {
      res.status(400).send('uuid missing')
      return
    }
    if (!type) {
      res.status(400).send('type missing')
      return
    }

    let key
    // TODO: authorization
    if (type === 'bookcover') key = `bookcover/${uuid}.png`
    else if (type === 'sectioncover') key = `sectioncover/${uuid}.png`
    else if (type === 'material') key = `material/${uuid}.png`
    else if (type === 'explanation') key = `explanation/${uuid}.png`
    else if (type === 'content') key = `content/${uuid}.png`
    else {
      res.status(400)
        .send('type should be one of bookcover, sectioncover, material, explanation or content')
      return
    }

    const params = { Bucket: process.env.S3_BUCKET, Key: key, Expires: 3600 }
    const result = await s3.getSignedUrlPromise('getObject', params)
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
