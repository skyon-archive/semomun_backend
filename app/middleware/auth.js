const { verifyJwt } = require('../services/auth')

exports.authJwt = (req, res, next) => {
  const authorization = req.headers.authorization
  const accessToken = authorization ? authorization.split('Bearer ')[1] : null
  if (!accessToken) res.status(401).send()
  else {
    const { ok, result, message } = verifyJwt(accessToken)
    if (ok) {
      req.uid = result.uid
      next()
    } else res.status(401).send(message)
  }
}
