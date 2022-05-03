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

function Conflict (message) {
  this.message = message
  this.stack = Error().stack
}
Conflict.prototype = Object.create(Error.prototype)
Conflict.prototype.name = 'Conflict'

function Forbidden (message) {
  this.message = message
  this.stack = Error().stack
}
Forbidden.prototype = Object.create(Error.prototype)
Forbidden.prototype.name = 'Forbidden'

exports.BadRequest = BadRequest
exports.Forbidden = Forbidden
exports.NotFound = NotFound
exports.Conflict = Conflict
