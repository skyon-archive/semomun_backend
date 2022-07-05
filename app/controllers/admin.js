const { selectWorkbooks, selectWorkbookByWid } = require('../services/admin.js');
const { parseIntDefault } = require('../utils.js');

exports.getWorkbooks = async (req, res) => {
  console.log('##### 도서 전체 조회 API #####');
  const { offset, limit, keyword, order } = req.query;
  const { count, rows } = await selectWorkbooks(
    parseIntDefault(offset, 1),
    parseIntDefault(limit, 15),
    keyword || '',
    order === 'ASC' ? 'ASC' : 'DESC'
  );

  const resultData = rows.map((row) => {
    const rowData = row.get({ plain: true });
    return {
      ...rowData,
      item: undefined,
      isHidden: rowData.isHidden === 'HIDDEN' ? true : false,
    };
  });

  res.status(200).json({ totalWorkbookCounts: count, workbooks: resultData });
};

exports.getWorkbookByWid = async (req, res) => {
  console.log('##### 도서 상세 조회 API #####');
  const { wid } = req.params;
  const result = await selectWorkbookByWid(wid);
  const resultData = result.get({plain:true})
  delete resultData.item
  resultData.isHidden = resultData.isHidden === 'HIDDEN' ? true : false
  res.status(200).json(resultData);
};
