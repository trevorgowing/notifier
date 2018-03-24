'use strict'

const firebase = require('../firebase')
const logger = require('../logger')

exports.send = (recipient, message) => {
  if (typeof recipient.firebaseToken === 'undenfined') {
    logger.debug(`Skipping mobile nofication: no firebase token for recipient ${recipient._id}`)
    return
  }

  let notification = {
    token: recipient.firebaseToken,
    notification: {
      title: message.title,
      body: message.body
    }
  }

  firebase.messaging.send(notification)
    .then((response) => {
      logger.info(`Successfully sent mobile notification to ${recipient._id}: ${response}`
    })
    .catch((error) => {
      logger.error(error)
    })
}
