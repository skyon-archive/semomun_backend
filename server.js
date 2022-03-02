require('dotenv').config()
const express = require('express')
const responseTime = require('response-time')
const cors = require('cors')
const path = require('path')
const app = express()
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

const corsOptions = {
  origin: ['http://localhost:8081', 'http://localhost:3000', 'https://www.semomun.com', 'https://semomun.com']
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(
  express.urlencoded({ extended: true })
)

const db = require('./app/models/index')
db.sequelize.sync()

require('./app/services/redis')

app.use(express.static(path.join(process.env.DATA_SOURCE)))

app.use(
  responseTime((req, res, time) => {
    console.log(`${req.method} ${req.originalUrl} ${time} ${res.statusCode}`)
  })
)

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(process.env.LOG_SOURCE)
})
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }))

app.get('/', (req, res) => {
  res.json({ message: 'Semomun API.' })
})

require('./app/routes/workbooks')(app)
require('./app/routes/sections')(app)
require('./app/routes/upload')(app)
require('./app/routes/info')(app)
require('./app/routes/auth')(app)
require('./app/routes/user')(app)
require('./app/routes/s3')(app)
require('./app/routes/sms')(app)
require('./app/routes/tags')(app)

const PORT = process.env.PORT
const HOST = process.env.HOST
app.listen(PORT, HOST)
console.log(`Server is running on port ${PORT}.`)
