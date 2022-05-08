require('dotenv').config()
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const uploadImage = async ({ url, fields }, filePath) => {
  const formData = new FormData()
  Object.entries(fields).forEach(([name, value]) =>
    formData.append(name, value)
  )
  formData.append(
    'file',
    fs.createReadStream(filePath),
    { knownLength: fs.statSync(filePath).size }
  )
  await axios.post(
    url,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Content-Length': formData.getLengthSync()
      }
    }
  ).catch(console.log)
}

const update = async (folderPath) => {
  const innerFolders = fs.readdirSync(folderPath)
  for (const innerFolder of innerFolders) {
    if (innerFolder[0] === '.') continue
    const files = fs.readdirSync(path.join(folderPath, innerFolder))
    for (const file of files) {
      const title = file.slice(0, -4)
      if (title[0] === '.') continue
      console.log(title)
      const { data, status } = await axios.patch(
        'https://api.semomun.com/upload/bookcover',
        { title },
        { headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` } }
      )
      console.log(status)
      if (status === 200) {
        const filePath = path.join(folderPath, innerFolder, file)
        await uploadImage(data.bookcoverPost, filePath)
        await uploadImage(data.sectioncoverPost, filePath)
      }
    }
  }
}

update('/Users/im-yujin/Downloads/fix')
