const { OAuth2Client } = require("google-auth-library");
CLIENT_ID =
  "436503570920-07bqbk38ub6tauc97csf5uo1o2781lm1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
exports.get = async (req, res) => {
  try {
    const token = req.query.id_token;
    console.log("token: " + token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log("userid: " + userid);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Section.",
    });
  }
};
