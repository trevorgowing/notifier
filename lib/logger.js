'use strict'

const pino = require('pino')
const pkg = require('../package')

// TODO: Remove once https://github.com/pinojs/pino/pull/245 is merged
function responseSerialiser (response) {
  if (!response || !response.statusCode) {
    return response
  }
  return {
    statusCode: response.statusCode,
    headers: response.getHeaders()
  }
}

const logger = pino({
  name: `${pkg.name}@${pkg.version}`,
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: responseSerialiser
  },
  level: process.env.LOG_LEVEL || 'info',
  enabled: process.env.NODE_ENV !== 'test'
})

module.exports = exports = logger
