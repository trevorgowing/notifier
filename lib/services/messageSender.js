'use strict'

const logger = require('../logger')
const recipientRepository = require('../repositories/recipient')
const smsSender = require('./sms')

exports.sendMessage = (message) => {
  recipientRepository.findById(message.recipientId, (error, recipient) => {
    if (error) {
      return logger.error(`Message sending unsuccessful: Recipient not found for id: ${message.recipientId}`)
    }

    if (recipient.email) {
      // Send email
    }
    if (recipient.mobileNumber) {
      smsSender.send({
        to: recipient.mobileNumber,
        from: 'Awesome Notifier',
        message: message.body
      }, smsResponseHandler)
    }
  })
}

const smsResponseHandler = (error, response) => {
  if (error) {
    return logger.error(error)
  }

  if (response.status > 0) {
    return logger.error(`Could not send sms: ${response}`)
  }
}
