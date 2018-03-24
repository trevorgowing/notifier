'use strict'

const {Router} = require('express')
const recipientHandler = require('./handlers/recipient')
const messageHandler = require('./handlers/message')

module.exports = exports = () => {
  const router = Router()

  router.route('/recipients')
    .get(recipientHandler.handleGetAll)
    .post(recipientHandler.handlePost)

  router.route('/recipients/:id')
    .get(recipientHandler.handleGet)
    .put(recipientHandler.handlePut)
    .delete(recipientHandler.handleDelete)

  router.route('/recipients/:id/messages')
    .post(messageHandler.handlePost)
    .get(messageHandler.handleGetAll)

  return router
}
