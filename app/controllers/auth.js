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

exports.url = async (req, res) => {
  res.status(200).json({ url:jwt.decode("eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLnNlbW9tdW4uYXV0aGVudGljYXRlIiwiZXhwIjoxNjQxMDUzNDQ4LCJpYXQiOjE2NDA5NjcwNDgsInN1YiI6IjAwMTc2My5hMDcxYjg0NDdlYzI0OTUyODljMzZlNjUxZTAwYTZjYy4wNzMxIiwiY19oYXNoIjoiR19zRjdPYTQ5Z2JsbUFNOGp5MFNqUSIsImVtYWlsIjoidHp3cHBjcWJ4ZkBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJpc19wcml2YXRlX2VtYWlsIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY0MDk2NzA0OCwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.YXUQqjKX3k_HWdCypye1WDcarq2wAWxpOVUtgu4YlHJDA0yHemX-g8iQogI65zEw7bfuB78WG5iHQJq5bWGGbhR1mXK5EItnq4l-Rt99mLxmldkfzRJLs1BEVuT5dh6DHCStQNDZYZYAOS_U8Lvutfcs2DpJ8ryWt2HOWNb2cazNOiwsRt78Yz79pM-antnuTLalK5ikoVmGqwDBug1rZ12iwaUZbDTZZZtiTcdk0eFY_KvmrPvcTfTGZ7r1tbS27TJ_m33phqSvQtcqoLXF2AKYKwjSQ161sXAuH_Ln2eP5QvxY2VghrLe4qjF9D7fNlEOD-VZEbQHTtIWUP-cVPw") });

}

exports.login = async (req, res) => {
  try {
    const token_google = req.body.token_google;
    const token_apple = req.body.token_apple;

    const redis = createClient();
    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();

    var check = false;
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
      //const ticket = await auth.accessToken(token_apple);
      const idToken = jwt.decode(token_apple);
      console.log(idToken)
      const sub = idToken.sub;
      console.log(sub)
      check = await redis.exists("appleToken:" + sub);
    }
    res.status(200).json({ check: check });
    
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authentication.",
    });
  }
};
