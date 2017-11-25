'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const errorHandler = require('./handlers/error')
const notFoundHandler = require('./handlers/not-found')
const requestLogger = require('./middleware/request-logger')

const app = express()

app.disable('x-powered-by')

app.use(bodyParser.json())
app.use(requestLogger)
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = exports = app
