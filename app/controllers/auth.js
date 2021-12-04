const { createClient } = require("redis");
const { OAuth2Client } = require("google-auth-library");
CLIENT_ID =
  "436503570920-07bqbk38ub6tauc97csf5uo1o2781lm1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
exports.login = async (req, res) => {
  try {
    const token = req.body.token_google;
    console.log("token: " + token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log("userid: " + userid);

    const redis = createClient();
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();
    const check = await redis.exists(userid);

    res.status(200).json({ check: check });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authentication.",
    });
  }
};
