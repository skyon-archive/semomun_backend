const { ResultSubmissions } = require('../models/index.js');

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
  });
  if (resultSub) res.status(201).send();
  else res.status(400).json({ message: "INSERT ERROR" });
};
