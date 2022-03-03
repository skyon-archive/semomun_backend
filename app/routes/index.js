module.exports = (app) => {
  require('./workbooks')(app)
  require('./sections')(app)
  require('./upload')(app)
  require('./info')(app)
  require('./auth')(app)
  require('./user')(app)
  require('./s3')(app)
  require('./sms')(app)
  require('./tags')(app)
  require('./orders')(app)
}