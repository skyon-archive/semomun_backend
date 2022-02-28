const db = require('../models/index')
const { Workbooks, Sections, Items, WorkbookTags, Tags } = db

exports.fetchWorkbooks = async (req, res) => {
  try {
    const result = await Workbooks.findAndCountAll()
    res.json({ count: result.count, workbooks: result.rows })
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

exports.fetchWorkbook = async (req, res) => {
  try {
    const { wid } = req.params

    const workbook = await Workbooks.findOne({
      where: { wid },
      include: {
        model: Sections,
        as: 'sections'
      },
      raw: true,
      nest: true
    })
    if (!workbook) return res.status(404).send()

    const item = await Items.findOne({
      where: { id: workbook.id },
      raw: true
    })
    workbook.price = item.price
    workbook.sales = item.sales

    const workbookTags = await WorkbookTags.findAll({
      where: { wid },
      include: [
        {
          model: Tags,
          as: 'tid_Tag'
        }
      ]
    })
    workbook.tags = workbookTags.map(({ tid_Tag }) => tid_Tag)

    res.json(workbook).send()
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
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
