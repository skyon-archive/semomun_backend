const { createClient } = require("redis");
const { OAuth2Client } = require("google-auth-library");
const jwt = require('jsonwebtoken');
const path = require('path'); 
const AppleAuth = require('apple-auth'); 
const appleConfig = require('../config/apple.json');
const auth = new AppleAuth(appleConfig, path.join(__dirname, `../config/${appleConfig.private_key_path}`));

CLIENT_ID =
  "436503570920-07bqbk38ub6tauc97csf5uo1o2781lm1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
exports.login = async (req, res) => {
  try {
    const token_google = req.body.token_google;
    const token_apple = req.body.token_apple;

    const redis = createClient();
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();

    const check = false;
    if(token_google){ 
      const ticket = await client.verifyIdToken({
        idToken: token_google,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const sub = payload["sub"];
      check = await redis.exists("googleToken:" + sub);
    }
    if(token_apple){
      const ticket = await auth.accessToken(code);
      const idToken = jwt.decode(ticket.id_token);
      const email = idToken.email;
      const sub = idToken.sub;
      check = await redis.exists("appleToken:" + sub);
    }
    res.status(200).json({ check: check });
    
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authentication.",
    });
  }
};
