function BadRequest (message) {
  this.message = message
  this.stack = Error().stack
}
BadRequest.prototype = Object.create(Error.prototype)
BadRequest.prototype.name = 'BadRequest'

function NotFound (message) {
  this.message = message
  this.stack = Error().stack
}
NotFound.prototype = Object.create(Error.prototype)
NotFound.prototype.name = 'NotFound'

exports.BadRequest = BadRequest
exports.NotFound = NotFound
