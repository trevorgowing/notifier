'use strict'

const messageRepository = require('../repositories/message')
const messageSender = require('../services/message-sender')

exports.handlePost = (request, response, next) => {
  request.body.recipientId = request.params.id

  messageRepository.create(request.body, (err, message) => {
    if (err) {
      return next(err)
    }

    response.status(201).json(message).end()

    messageSender.sendMessage(message)
  })
}

exports.handleGetAll = (request, response, next) => {
  messageRepository.find(request.params.id, (error, messages) => {
    if (error) {
      return next(error)
    }

    return response.status(200).json(messages)
  })
}

exports.handleGetSingle = (request, response, next) => {
  messageRepository.findById(request.params.messageId, (error, message) => {
    if (error) {
      return next(error)
    }

    return response.status(200).json(message)
  })
}
