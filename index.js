'use strict'

const app = require('./lib/app')
const http = require('http')
const logger = require('./lib/logger')
const database = require('./lib/database')

const SHUTDOWN_TIMEOUT_MS = 10000

const server = http.createServer(app)

server.listen(8989, () => {
  logger.info('Started server')
})

function shutDown (exitCode) {
  logger.info('Shutting down')

  database.close()
  server.close()

  const timer = setTimeout(() => {
    logger.warn('Shutdown timed out, terminating')
    process.exit(128 + exitCode)
  }, SHUTDOWN_TIMEOUT_MS)
  timer.unref()
}

function handleSignal (signal, exitCode) {
  process.on(signal, () => {
    logger.info({signal}, 'Received shutdown signal')
    shutDown(exitCode)
  })
}

handleSignal('SIGINT', 2)
handleSignal('SIGTERM', 15)
