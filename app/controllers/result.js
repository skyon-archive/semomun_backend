const { ResultSubmissions, sequelize } = require('../models/index.js');
const { selectAllResultByWgid, selectOneResultByWid } = require('../services/result.js');

exports.postScoredData = async (req, res) => {
  const {
    wgid,
    wid,
    sid,
    rank,
    rawScore,
    perfectScore,
    standardScore,
    percentile,
    correctProblemCount,
    totalProblemCount,
    totalTime,
    subject,
  } = req.body;
  const uid = req.uid;
  console.log('################ CONTROLLER ################');

  console.log('USER ID =', uid);

  //   console.log(req);

  const resultSub = await ResultSubmissions.create({
    wgid,
    wid,
    sid,
    rank,
    rawScore,
    perfectScore,
    standardScore,
    percentile,
    correctProblemCount,
    totalProblemCount,
    totalTime,
    subject,
    uid,
  })
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log('ResultSubmissions Error');
      res.status(400).json({ err });
    });
};

exports.getAllResultByWgid = async (req, res) => {
  const { wgid } = req.params;
  const uid = req.uid;

  const result = [];
  const temp = await selectAllResultByWgid(uid, wgid);
  temp.forEach((rs) => {
    const rsData = rs.get({ plain: true });
    delete rsData.workbook;
    result.push(rsData);
  });
  res.status(200).json(result);
};

exports.getOneResultByWid = async (req, res) => {
  const { wid } = req.params;
  const uid = req.uid;

  const resultData = await selectOneResultByWid(uid, wid);
  const result = resultData.get({ plain: true });
  delete result.workbook;

  res.status(200).json(result);
};
