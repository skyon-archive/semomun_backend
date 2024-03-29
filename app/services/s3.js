const { S3 } = require('aws-sdk')
const { BadRequest } = require('../errors')

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
    Fields: { key: `${type}/${key}.png` },
    Conditions: [['content-length-range', 0, 10485760]] // 10 MiB
  }
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

exports.checkFileExist = (type, key) => {
  return s3.headObject({ Key: `${type}/${key}.png`, Bucket: process.env.S3_BUCKET })
    .promise()
    .catch(() => {
      throw new BadRequest(`${type}/${key}.png가 존재하지 않음`)
    })
}

exports.deleteFile = async (type, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${type}/${key}.png`
  }
  try {
    await s3.deleteObject(params).promise()
  } catch (err) {
    console.log(err)
  }
}

exports.deleteFileAsync = async (type, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${type}/${key}.png`
  }
  try {
    return await s3.deleteObject(params).promise()
  } catch (err) {
    console.log(err)
  }
}

const listFiles = async (prefix, continuationToken) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: prefix,
    ContinuationToken: continuationToken
  }
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

exports.listAllFiles = async (prefix) => {
  const result = []
  let continuationToken
  console.log(`listAllFiles: ${prefix}`)
  while (true) {
    const {
      IsTruncated: truncated,
      Contents: content,
      NextContinuationToken: nextContinuationToken
    } = await listFiles(prefix, continuationToken)
    console.log(truncated, nextContinuationToken)
    result.push(...content)
    if (truncated) continuationToken = nextContinuationToken
    else break
  }
  return result
}
