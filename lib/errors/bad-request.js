'use strict'

class BadRequestError extends Error {
  constructor (...args) {
    super(...args)
    this.name = this.constructor.name
    this.code = 'bad-request'
    this.httpStatusCode = 400
  }
}

module.exports = exports = BadRequestError
