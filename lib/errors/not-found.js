'use strict'

class NotFoundError extends Error {
  constructor (...args) {
    super(...args)
    this.name = this.constructor.name
    this.code = 'not-found'
    this.httpStatusCode = 404
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = exports = NotFoundError
