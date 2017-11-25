'use strict'

module.exports = exports = (err, req, res, next) => {
  req.logger.error({err}, 'Internal server error')
  res.sendStatus(500)
}
