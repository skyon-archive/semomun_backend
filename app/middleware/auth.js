const { verifyJwt } = require('../services/auth')
const { getUserByUid } = require('../services/user')

exports.authJwt = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const accessToken = authorization ? authorization.split('Bearer ')[1] : null
    if (!accessToken) {
      req.uid = null
      req.jwtMessage = 'no access token'
    } else {
      const { ok, result, message } = verifyJwt(accessToken)
      if (ok) {
        const user = await getUserByUid(result.uid)
        if (!user) {
          req.uid = null
          req.jwtMessage = 'user not exist'
        } else if (user.deleted) {
          req.uid = null
          req.jwtMessage = 'deleted user'
        } else {
          req.uid = user.uid
          req.role = user.role
        }
      } else {
        req.uid = null
        req.jwtMessage = message
      }
    }
  } catch (err) {
    console.log(err)
    req.uid = null
    req.jwtMessage = 'unknown error'
  }
  next()
}
