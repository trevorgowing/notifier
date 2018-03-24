'use strict'

const recipientRepository = require('../repositories/recipient') 

/* Placeholder for the real repository */
const messageRepository = {
  create: (message, callback) => {
    console.log(`Message received: ${message}`)
  },
  findById: (id, callback) => {}
}

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
