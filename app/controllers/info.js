const db = require('../models/index')
const Workbook = db.workbooks
const sequelize = db.sequelize

async function query (category, attr) {
  return Workbook.findAll({
    where: {
      category: category
    },
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col(attr)), attr]
    ],
    raw: true
  })
}

exports.category = async (req, res) => {
  try {
    const category = req.query.c
    const subject = { title: '과목', queryParamKey: 's', queryParamValues: (await query(category, 'subject')).map(res => res.subject) }
    const year = { title: '년도', queryParamKey: 'y', queryParamValues: (await query(category, 'year')).map(res => res.year) }
    const month = { title: '개월', queryParamKey: 'm', queryParamValues: (await query(category, 'month')).map(res => res.month) }
    const grade = { title: '학년', queryParamKey: 'g', queryParamValues: (await query(category, 'month')).map(res => res.grade) }
    res.json({ queryButtons: [subject, year, month, grade] })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.major = async (req, res) => {
  try {
    res.status(200).json({ major: [{ '문과 계열': ['인문', '상경', '사회', '교육', '기타'] }, { '이과 계열': ['공학', '자연', '의약', '생활과학', '기타'] }, { 예체능계열: ['미술', '음악', '체육', '기타'] }] })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
