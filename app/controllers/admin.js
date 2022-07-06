const {
  selectWorkbooks,
  selectWorkbookByWid,
  selectProblemsByWid,
} = require('../services/admin.js');
const { parseIntDefault } = require('../utils.js');

exports.getWorkbooks = async (req, res) => {
  console.log('##### 도서 전체 조회 API #####');
  const { offset, limit, keyword, order } = req.query;
  //   console.log('Offset =', offset);
  //   console.log('Limit =', limit);
  //   console.log('Keyword =', keyword);
  //   console.log('Order =', order);
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
  if (isNaN(wid)) return res.status(400).json({ message: 'wid must be only integer.' });

  const result = await selectWorkbookByWid(parseInt(wid));
  if (!result) return res.status(404).json({ message: 'Not found.' });

  const resultData = result.get({ plain: true });
  delete resultData.item;
  resultData.isHidden = resultData.isHidden === 'HIDDEN' ? true : false;
  res.status(200).json(resultData);
};

exports.getProblemsByWid = async (req, res) => {
  console.log('##### 문제 전제 조회 API #####');
  const { wid } = req.params;
  const { offset, limit } = req.query;
  //   console.log('Offset =', offset);
  //   console.log('Limit =', limit);
  if (isNaN(wid)) return res.status(400).json({ message: 'wid must be only integer.' });

  const { count, rows } = await selectProblemsByWid(
    wid,
    parseIntDefault(offset, 1),
    parseIntDefault(limit, 15)
  );

  res.status(200).json({ totalProblemCounts: count, problems: rows });
};
