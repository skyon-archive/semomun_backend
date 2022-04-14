const { Problems } = require('../models/index')

exports.fetchProblemByPid = (pid) => {
  return Problems.findByPk(
    pid,
    {
      include:
      {
        association: 'View',
        include: {
          association: 'Section',
          include: 'Workbook'
        }
      },
      raw: true,
      nest: true
    }
  )
}
