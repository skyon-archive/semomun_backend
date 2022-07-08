const { isBoolean } = require('lodash');
const {
  selectWorkbooks,
  selectWorkbookByWid,
  selectProblemsByWid,
  selectProblemByPid,
  selectWorkbookByTitle,
} = require('../services/admin.js');
const { checkFileExist, deleteFile, getPresignedPost } = require('../services/s3.js');
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
  const s3 = await getPresignedPost('bookcover', resultData.bookcover);
  resultData.s3 = s3;
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

  const resultData = result.get({ plain: true });
  const content = await getPresignedPost('content', resultData.content);
  const explanation = await getPresignedPost('explanation', resultData.explanation);

  resultData.s3 = { content, explanation };
  res.status(200).json(resultData);
};

exports.putWorkbookByWid = async (req, res) => {
  console.log('##### Workbook 정보 수정 API #####');
  const { wid } = req.params;
  if (isNaN(wid)) return res.status(400).json({ message: 'wid must be only integer.' });

  const { title, author, publishCompany, price, isHidden, isChangedImage } = req.body;
  const type = isHidden === true ? 'HIDDEN' : '';

  // title 예외 처리
  if (title.length > 250) {
    return res
      .status(400)
      .json({ message: 'The number of characters in the title cannot be greater than 250.' });
  }
  if (author.length > 30 || publishCompany.length > 30) {
    return res.status(400).json({
      message:
        'The number of characters in the author and publishCompany cannot be greater than 30.',
    });
  }

  // price 예외 처리
  if (isNaN(price)) return res.status(400).json({ message: 'price must be only integer.' });
  if (parseInt(price) < 0 || parseInt(price) > 10000000)
    return res.status(400).json({ message: 'price ranges from 0 to 100000000.' });

  // isHidden 예외처리
  if (!isBoolean(isHidden))
    return res.status(400).json({ message: 'isHidden must be only boolean' });

  const workbook = await selectWorkbookByWid(wid);
  if (!workbook) return res.status(404).json({ message: 'Not found.' });

  // title 중복 예외 처리
  const isConflict = (await selectWorkbookByTitle(wid, title)) === null ? false : true;
  if (isConflict) return res.status(409).json({ message: 'Already using title' });

  const payload = { title, author, publishCompany, type };
  workbook.update(payload);
  workbook.item.update({ price: price });

  const bookcoverUUID = workbook.bookcover;
  if (isChangedImage) {
    await checkFileExist('bookcover', bookcoverUUID);
    await deleteFile('bookcover', bookcoverUUID);
  }
  res.status(204).send();
};

exports.putProblemByPid = async (req, res) => {
  console.log('##### Problem 정보 수정 API #####');
  const { pid } = req.params;
  const { index, btType, type, answer, score, isChangedContent, isChangedExplanation } = req.body;
  if (isNaN(index) || isNaN(type) || isNaN(score))
    return res.status(400).json({ message: 'index, type and score must be only integer.' });
  const problem = await selectProblemByPid(pid);
  if (!problem) return res.status(404).json({ message: 'Not found.' });

  const contentUUID = problem.content
  const explanationUUID = problem.explanation

  const payload = { index, btType, type, answer, score };
  problem.update(payload);

  if (isChangedContent) {
    await checkFileExist('content', contentUUID);
    await deleteFile('content', contentUUID);
  }
  if (isChangedExplanation) {
    await checkFileExist('explanation', explanationUUID);
    await deleteFile('explanation', explanationUUID);
  }
  res.status(204).send();
};
