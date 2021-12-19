const { createClient } = require("redis");
const { OAuth2Client } = require("google-auth-library");
CLIENT_ID =
  "436503570920-07bqbk38ub6tauc97csf5uo1o2781lm1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

exports.category = async (req, res) => {
  try {
    res.status(200).json({ "category":["수능 및 모의고사", "LEET", "공인회계사", "공인중개사", "9급 공무원"]});
  } catch (e) {
    console.log(e);
  }
};

exports.major = async (req, res) => {
  try {
    res.status(200).json({ "major":[{"문과 계열":["인문", "상경", "사회", "교육", "기타"]}, {"이과 계열":["공학", "자연", "의약", "생활과학", "기타"]}, {"예체능계열":["미술", "음악", "체육", "기타"]}] });
  } catch (e) {
    console.log(e);
  }
};
