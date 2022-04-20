const path = require('path')
const { UserInfo } = require('../models/index')
const { createUser } = require('../services/user')
const { readCsv } = require('./utils')

exports.migrateUsers = async () => {
  try {
    const users = (await readCsv(
      path.resolve(__dirname, 'users.csv'),
      (user) => user
    ))
    const cnt = users.length
    for (let i = 0; i * 100 < cnt; i += 1) {
      console.log(`i = ${i}`)
      await Promise.all(users.slice(i * 100, (i + 1) * 100).map(async (user) => {
        await createUser({
          usernameDup: true,
          username: user.name,
          phone: '',
          school: user.school,
          major: user.major,
          majorDetail: user.majorDetail,
          favoriteTags: [],
          graduationStatus: user.graduationStatus,
          marketing: 0,
          googleId: user.appleId.length === 21 ? user.appleId : null,
          appleId: user.appleId.length === 44 ? user.appleId : null
        })
      }))
    }
  } catch (err) {
    console.log(err)
  }
}

exports.fixSchool = async () => {
  try {
    const users = (await readCsv(
      path.resolve(__dirname, 'users.csv'),
      (user) => user
    ))
    const cnt = users.length
    for (let i = 0; i * 100 < cnt; i += 1) {
      console.log(`i = ${i}`)
      await Promise.all(users.slice(i * 100, (i + 1) * 100).map(async (user) => {
        await UserInfo.update(
          { school: user.school },
          { where: { appleId: user.appleId } }
        )
        await UserInfo.update(
          { school: user.school },
          { where: { googleId: user.appleId } }
        )
      }))
    }
  } catch (err) {
    console.log(err)
  }
}
