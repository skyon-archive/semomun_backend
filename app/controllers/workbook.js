const db = require('../models/index')
const Workbook = db.Workbooks
const Section = db.Sections

exports.fetchWorkbooks = async (req, res) => {
  try {
    const result = await Workbook.findAndCountAll()
    res.json({ count: result.count, workbooks: result.rows })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

/*
exports.resize = (req, res) => {
  const width = req.params.width
  // sharp(imagePath).resize({width:65}).toFile("sharp_resize1.jpg");

  const dir = '../public/images/workbook/' + width + 'x' + width
  fs.readdir(dir, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err)
    }
    files.forEach((src) => {
      console.log(src)
      // sharp(src).resize({width:width})).toFile();
    })
  })
}
*/

/*
exports.create = async (req, res) => {
  const workbooks = []
  const subjects = ['수학', '국어', '과탐', '영어']
  const months = [3, 6, 9]
  for (let i = 1; i <= 12; i++) {
    const workbook = {
      title: '2022년 ' + months[i % 3] + '월 ' + subjects[i % 4] + ' 모의평가',
      year: 2021,
      month: months[i % 3],
      price: 0,
      detail: '',
      publisher: '한국교육과정평가원',
      category: '수능 모의고사',
      subject: subjects[i % 4],
      grade: 12,
      bookcover: 'A' + (300 + i) + '.jpeg'
    }
    workbooks.push(workbook)
  }
  try {
    await Workbook.bulkCreate(workbooks)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating Workbooks.'
    })
  }

  const sections = []
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 1; j++) {
      const section = {
        wid: i,
        title: j + '교시',
        index: j,
        detail: '',
        cutoff: '',
        sectioncover: 'A' + (300 + i) + '.jpeg'
      }
      sections.push(section)
    }
  }
  try {
    await Section.bulkCreate(sections)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating Sections.'
    })
  }
  const views = []
  const problems = []
  for (let i = 1; i <= 6; i++) {
    const view = {
      sid: 1,
      index_start: i,
      index_end: i,
      form: 0
    }
    views.push(view)
    for (let j = 1; j <= 1; j++) {
      const problem = {
        vid: i,
        sid: 1,
        icon_index: i,
        icon_name: String(i),
        type: 5,
        answer: '3',
        content: 'A' + (300 + i) + '.jpeg',
        explanation: 'A' + (300 + i) + '.jpeg'
      }
      problems.push(problem)
    }
  }
  try {
    await View.bulkCreate(views)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating Views.'
    })
  }
  try {
    const data = await Problem.bulkCreate(problems)
    res.send(data)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating Problems.'
    })
  }
}
*/

exports.fetch_workbook = async (req, res) => {
  let sections
  await Section.findAll({
    where: {
      wid: req.params.wid
    }
  })
    .then((data) => {
      sections = data
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Sections.'
      })
    })
  Workbook.findOne({
    where: {
      wid: req.params.wid
    }
  })
    .then((data) => {
      res.send({ workbook: data, sections: sections })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Workbooks.'
      })
    })
}

/*
exports.put = (req, res) => {
  req.body.index
  req.body.title
  req.body.detail
  req.body.cutoff

  req.body.views

  const section = {
    index: req.body.index,
    title: req.body.title,
    detail: req.body.detail,
    cutoff: req.body.cutoff
  }

  Section.create(section)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Sections.'
      })
    })
  View.bulkCreate(views)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Views.'
      })
    })
  Problem.bulkCreate(problems)
    .then((data) => {
      data
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating Problems.'
      })
    })
}
*/
