function CustomError (message) {
  this.message = message
  this.stack = Error().stack
}
CustomError.prototype = Object.create(Error.prototype)
CustomError.prototype.name = 'CustomError'

exports.CustomError = CustomError
