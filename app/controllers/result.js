const { ResultSubmissions, sequelize } = require('../models/index.js');
const {
  selectAllResultByWgid,
  selectOneResultByWid,
  selectResultByWidFromAllUser,
} = require('../services/result.js');

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
  const result = await ResultSubmissions.findOne({ where: { uid, wid } });
  if (result) {
    res.status(200).json({});
  } else {
    await ResultSubmissions.create({
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
        res.status(201).json({});
      })
      .catch((err) => {
        console.log('ResultSubmissions Error');
        res.status(400).json({ err });
      });
  }
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
  const { type } = req.query;
  const uid = req.uid;

  if (type === 'public') {
    const resultsData = await selectResultByWidFromAllUser(wid);
    const resultData = resultsData[0].get({ plain: true });

    const rawScore = parseInt(
      resultsData.reduce((acc, cur) => {
        return parseInt(acc) + parseInt(cur.rawScore || 0);
      }, 0) / resultsData.length
    );

    const standardScore = parseInt(
      resultsData.reduce((acc, cur) => {
        return parseInt(acc) + parseInt(cur.standardScore || 0);
      }, 0) / resultsData.length
    );

    const percentile = parseInt(
      resultsData.reduce((acc, cur) => {
        return parseInt(acc) + parseInt(cur.percentile || 0);
      }, 0) / resultsData.length
    );

    const newData = {
      rsid: resultData.rsid,
      uid: resultData.uid,
      wgid: resultData.wgid,
      wid: resultData.wid,
      sid: resultData.sid,
      rawScore,
      standardScore,
      percentile,
      createdAt: resultData.createdAt,
      updatedAt: resultData.updatedAt,
    };
    res.status(200).json(newData);
  } else {
    const resultData = await selectOneResultByWid(uid, wid);
    if (resultData === null) return res.status(200).json(null);
    const result = resultData.get({ plain: true });
    delete result.workbook;

    res.status(200).json(result);
  }
};
