'use strict'

const logger = require('../logger')
const onFinished = require('on-finished')

module.exports = exports = (req, res, next) => {
  req.logger = logger
  req.logger.info({req}, `Received ${req.method} ${req.path}`)

  onFinished(res, (err, res) => { // eslint-disable-line handle-callback-err
    req.logger.info({res}, `Sent ${res.statusCode} response`)
  })

  next()
}
