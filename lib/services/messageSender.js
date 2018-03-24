'use strict'

const logger = require('../logger')
const recipientRepository = require('../repositories/recipient')

exports.sendMessage = (message) => {
  recipientRepository.findById(message.recipientId, (error, recipient) => {
    if (error) {
      return logger.error(`Message sending unsuccessful: Recipient not found for id: ${message.recipientId}`)
    }
    
    if (recipient.email) {
      // Send email
    }
    if (recipient.mobileNumber) {
      // Send sms
    }
    return
  })
}
