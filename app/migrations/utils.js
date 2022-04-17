const fs = require('fs')
const csv = require('fast-csv')
const { S3 } = require('aws-sdk')

exports.s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

exports.readCsv = (filepath, processor) => {
  return new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream(filepath)
      .pipe(csv.parse({ headers: true }))
      .on('error', reject)
      .on('data', (row) => {
        const obj = processor(row)
        if (obj) data.push(obj)
      })
      .on('end', () => resolve(data))
  })
}
