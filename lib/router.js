'use strict'

const {Router} = require('express')
const recipientHandler = require('./handlers/recipient')

module.exports = exports = () => {
  const router = Router()

  router.post('/recipients', recipientHandler.handlePost)

  router.route('/recipients/:id')
    .get(recipientHandler.handleGet)
    .put(recipientHandler.handlePut)
    .delete(recipientHandler.handleDelete)

  return router
}
