'use strict'

const recipientRepository = require('../repositories/recipient')
const messageRepository = require('../repositories/message')

exports.handlePost = (request, response, next) => {
  recipientRepository.findById(request.params.id, (error, recipient) => {
    if (error) {
      return next(error)
    }

    request.body.recipientId = request.params.id

    messageRepository.create(request.body, (err, message) => {
      if (err) {
        return next(err)
      }

      return response.status(201).json(message)
    })
  })
}

exports.handleGetAll = (request, response, next) => {
  recipientRepository.findById(request.params.id, (error, recipient) => {
    if (error) {
      return next(error)
    }

    messageRepository.find(request.params.id, (error, messages) => {
      if (error) {
        return next(error)
      }

      return response.status(200).json(messages)
    })
  })
}
