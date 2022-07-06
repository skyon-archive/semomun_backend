const { isBoolean } = require('lodash');
const {
  selectWorkbooks,
  selectWorkbookByWid,
  selectProblemsByWid,
  selectProblemByPid,
  selectWorkbookByTitle,
} = require('../services/admin.js');
const { parseIntDefault } = require('../utils.js');

exports.getWorkbooks = async (req, res) => {
  console.log('##### 도서 전체 조회 API #####');
  const { offset, limit, order } = req.query;
  let { keyword } = req.query;
  //   console.log('Offset =', offset);
  //   console.log('Limit =', limit);
  //   console.log('Keyword =', keyword);
  if (keyword === 'allworkbook') keyword = '';
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

exports.getProblemByPid = async (req, res) => {
  console.log('##### 문제 상세 조회 API #####');
  const { pid } = req.params;
  if (isNaN(pid)) return res.status(400).json({ message: 'pid must be only integer.' });
  const result = await selectProblemByPid(pid);
  if (!result) return res.status(404).json({ message: 'Not found.' });
  res.status(200).json(result);
};

exports.putWorkbookByWid = async (req, res) => {
  console.log('##### Workbook 정보 수정 API #####');
  const { wid } = req.params;
  if (isNaN(wid)) return res.status(400).json({ message: 'wid must be only integer.' });

  const { title, author, publishCompany, price, isHidden } = req.body;
  const type = isHidden === true ? 'HIDDEN' : '';
  if (isNaN(price)) return res.status(400).json({ message: 'price must be only integer.' });
  if (parseInt(price) < 0)
    return res.status(400).json({ message: 'price cannot be less than zero.' });

  if (!isBoolean(isHidden))
    return res.status(400).json({ message: 'isHidden must be only boolean' });

  const workbook = await selectWorkbookByWid(wid);
  if (!workbook) return res.status(404).json({ message: 'Not found.' });

  const isConflict = (await selectWorkbookByTitle(wid, title)) === null ? false : true;
  console.log('isConflict =', await selectWorkbookByTitle(wid, title));
  if (isConflict) return res.status(409).json({ message: 'Already using title' });

  const payload = { title, author, publishCompany, type };

  workbook.update(payload);
  workbook.item.update({ price: price });
  res.status(204).send();
};
