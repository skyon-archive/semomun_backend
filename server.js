require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const MAX_CHARGE_SEMOPAY = 1000000
module.exports = { MAX_CHARGE_SEMOPAY }

const corsOptions = {
  origin: [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://www.semomun.com',
    'https://semomun.com'
  ],
  credentials: true
}

const env = process.env.NODE_ENV
// console.log(env)

if (env && (env === 'production' || env === 'test')) {
  Sentry.init({
    dsn: 'https://b932b1e6a7984da985befd32b44dd91e@o1300439.ingest.sentry.io/6583583',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    environment: env,
    release: 'semomun_backend@' + process.env.VERSION,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler())
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler())
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

const { swaggerUi, specs } = require('./swagger/swagger.js')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

require('./app/models/index')
require('./app/services/redis')
require('./app/routes/index')(app)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

const PORT = process.env.PORT
const HOST = process.env.HOST
app.listen(PORT, HOST)
console.log(`Server is running on port ${PORT}.`)
