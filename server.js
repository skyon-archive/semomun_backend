require('dotenv').config()
const express = require('express')
const responseTime = require('response-time')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const MAX_CHARGE_SEMOPAY = 1000000;
module.exports = { MAX_CHARGE_SEMOPAY };

const corsOptions = {
  origin: [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://www.semomun.com',
    'https://semomun.com',
  ],
  credentials: true
};
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

require('./app/models/index')
require('./app/services/redis')

// ???
// app.use(express.static(path.join(process.env.DATA_SOURCE)))

// response-time package 사용?
app.use(
  responseTime((req, res, time) => {
    console.log(`${req.method} ${req.originalUrl} ${time} ${res.statusCode}`)
  })
)

// 로그용
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'))

require('./app/routes/index')(app)

const PORT = process.env.PORT
const HOST = process.env.HOST
app.listen(PORT, HOST)
console.log(`Server is running on port ${PORT}.`)
