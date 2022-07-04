const { verifyJwt } = require('../services/auth');
const { getUserByUid } = require('../services/user');

exports.authJwt = async (req, res, next) => {
  try {
    console.log('############# AUTH MIDDLEWARE ###########');
    const { authorization } = req.headers;
    console.log('AUTHO', authorization);
    // if (authorization === undefined) {
    //   return res.status(401).json({ message: 'The token does not exist.' });
    // } else {
    // console.log('???????????????????????????');
    const accessToken = authorization ? authorization.split('Bearer ')[1] : null;
    console.log('ACC', accessToken);

    const { ok, result, message } = verifyJwt(accessToken);
    console.log('OK', ok, result, message);
    if (ok) {
      const user = await getUserByUid(result.uid);
      console.log('USER', user);
      if (!user) {
        // return res.status(401).json({ message: 'User does not exist.' });
        req.uid = null;
        req.jwtMessage = 'user not exist';
      } else if (user.deleted) {
        // return res.status(401).json({ message: 'Deleted user.' });
        req.uid = null;
        req.jwtMessage = 'deleted user';
      } else {
        req.uid = user.uid;
        req.role = user.role;
      }
    } else {
      // if (message === 'jwt expired') return res.status(401).json({ message: 'Token time out.' });
      // return res.status(401).json({ message: 'Invalid token' });
      req.uid = null;
      req.jwtMessage = message;
    }
    // }
  } catch (err) {
    console.log(err);
    req.uid = null;
    req.jwtMessage = 'unknown error';
  }
  next();
};
