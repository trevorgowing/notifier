'use strict'

const recipientRepository = require('../repositories/recipient')

exports.handleGetAll = (request, response, next) => {
  recipientRepository.find((error, recipients) => {
    if (error) {
      return next(error)
    }

    response.status(200).json(recipients)
  })
}

exports.handlePost = (request, response, next) => {
  recipientRepository.create(request.body, (error, recipient) => {
    if (error) {
      return next(error)
    }

    response.status(201).json(recipient)
  })
}

exports.handleGet = (request, response, next) => {
  recipientRepository.findById(request.params.id, (error, recipient) => {
    if (error) {
      return next(error)
    }

    response.status(200).json(recipient)
  })
}

exports.handlePut = (request, response, next) => {
  recipientRepository.update(request.params.id, request.body, (error, recipient) => {
    if (error) {
      return next(error)
    }

    response.status(200).json(recipient)
  })
}

exports.handleDelete = (request, response, next) => {
  recipientRepository.delete(request.params.id, (error) => {
    if (error) {
      return next(error)
    }

    response.sendStatus(204)
  })
}
