require('dotenv').config()
const express = require('express')
const responseTime = require('response-time')
const cors = require('cors')
const path = require('path')
const app = express()

const corsOptions = {
  origin: 'http://localhost:8081'
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(
  express.urlencoded({ extended: true })
)

const db = require('./app/models/index')

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.')
})

app.use(express.static(path.join(__dirname, '/../data/')))

app.use(
  responseTime((req, res, time) => {
    console.log(`${req.method} ${req.url} ${time}`)
  })
)

app.get('/', (req, res) => {
  res.json({ message: 'Semomun API.' })
})

require('./app/routes/workbooks')(app)
require('./app/routes/sections')(app)
require('./app/routes/upload')(app)
require('./app/routes/info')(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
