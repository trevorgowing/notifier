'use strict'

class ConflictError extends Error {
  constructor (...args) {
    super(...args)
    this.name = this.constructor.name
    this.code = 'conflic'
    this.httpStatusCode = 409
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = exports = ConflictError
