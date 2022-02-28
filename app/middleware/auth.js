const { verifyJwt } = require('../services/auth')

exports.authJwt = (req, res, next) => {
  const authorization = req.headers.authorization
  const accessToken = authorization ? authorization.split('Bearer ')[1] : null
  if (!accessToken) {
    req.uid = null
    req.jwtMessage = 'no access token'
  } else {
    const { ok, result, message } = verifyJwt(accessToken)
    if (ok) req.uid = result.uid
    else {
      req.uid = null
      req.jwtMessage = message
    }
  }
  next()
}
