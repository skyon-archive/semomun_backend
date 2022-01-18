const db = require('../models/index')
const Workbook = db.workbooks
const sequelize = db.sequelize

async function query (category, attr) {
  const res = Workbook.findAll({
    where: {
      category: category
    },
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col(attr)), attr]
    ],
    order: [
      [attr, 'ASC']
    ],
    raw: true
  }).map(workbook => workbook[attr])
  /*
  res.sort(function (x, y) {
    const a = x.toUpperCase()
    const b = y.toUpperCase()
    return a === b ? 0 : a > b ? 1 : -1
  })
  */
  return res
}

exports.category = async (req, res) => {
  try {
    const result = await Workbook.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      raw: true
    })
    res.json({ category: result.map(res => res.category) })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.buttons = async (req, res) => {
  try {
    const category = req.query.c
    const subject = { title: '과목', queryParamKey: 's', queryParamValues: (await query(category, 'subject')) }
    const year = { title: '년도', queryParamKey: 'y', queryParamValues: (await query(category, 'year')) }
    const month = { title: '월', queryParamKey: 'm', queryParamValues: (await query(category, 'month')) }
    const grade = { title: '학년', queryParamKey: 'g', queryParamValues: (await query(category, 'grade')) }
    res.json({ queryButtons: [subject, year, month, grade] })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.major = async (req, res) => {
  try {
    res.json({ major: [{ '문과 계열': ['인문', '상경', '사회', '교육', '기타'] }, { '이과 계열': ['공학', '자연', '의약', '생활과학', '기타'] }, { 예체능계열: ['미술', '음악', '체육', '기타'] }] })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
