const { S3 } = require('aws-sdk')

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

exports.getPresignedUrl = (type, key) => {
  const params = { Bucket: process.env.S3_BUCKET, Key: `${type}/${key}.png`, Expires: 3600 }
  return s3.getSignedUrlPromise('getObject', params)
}

exports.getPresignedPost = (type, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Fields: { key: `${type}/${key}` },
    Conditions: [['content-length-range', 0, 10485760]] // 10 MiB
  }
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}
