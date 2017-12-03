'use strict'

const recipientHandler = require('../../lib/handlers/recipient')
const recipientRepository = require('../../lib/repositories/recipient')
const sinon = require('sinon')
const tap = require('tap')
const uuid = require('uuid/v1')

const noOpLogger = {
  trace () {},
  debug () {},
  info () {},
  warn () {},
  error () {},
  fatal () {}
}

tap.test('RecipientHandler', t => {
  const sandbox = sinon.sandbox.create()

  const response = {
    status () {
      return this
    },
    json () {},
    sendStatus () {}
  }

  t.afterEach(next => {
    sandbox.restore()
    next()
  })

  t.test('handleGet', t => {
    t.beforeEach((next) => {
      sandbox.spy(response, 'status')
      sandbox.spy(response, 'json')
      next()
    })

    t.test('should call next with an error when recipientRepository.findOne() yields an error', t => {
      const recipientId = uuid()
      const error = new Error(':(')
      const request = {
        params: {
          id: recipientId
        },
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'findById').yields(error)

      recipientHandler.handleGet(request, response, next)

      t.ok(next.calledWith(error))
      t.end()
    })

    t.test('should send 200 response containing recipient when recipientRepository yields recipient', t => {
      const recipientId = uuid()
      const recipient = {
        _id: recipientId
      }
      const request = {
        params: {
          id: recipientId
        },
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'findById').yields(null, recipient)

      recipientHandler.handleGet(request, response, next)

      t.ok(recipientRepository.findById.calledWith(request.params.id, sinon.match.func))
      t.ok(response.status.calledWith(200))
      t.ok(response.json.calledWith(recipient))
      t.end()
    })

    t.end()
  })

  t.test('handlePost', t => {
    t.beforeEach((next) => {
      sandbox.spy(response, 'status')
      sandbox.spy(response, 'json')
      next()
    })

    t.test('should call next with an error when recipient repository.create() yields an error', t => {
      const error = new Error(':(')
      const recipient = {
        email: 'trevor@email.com',
        phone: '831234567'
      }
      const request = {
        body: recipient,
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'create').yields(error)

      recipientHandler.handlePost(request, response, next)

      t.ok(next.calledWith(error))
      t.end()
    })

    t.test('should send 201 response containing recipient when recipientRepository.create() yields recipient', t => {
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const identifiedRecipient = Object.assign({}, {_id: uuid()}, recipient)
      const request = {
        body: recipient,
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'create').yields(null, identifiedRecipient)

      recipientHandler.handlePost(request, response, next)

      t.ok(recipientRepository.create.calledWith(request.body, sinon.match.func))
      t.ok(response.status.calledWith(201))
      t.ok(response.json.calledWith(identifiedRecipient))
      t.end()
    })

    t.end()
  })

  t.test('handlePut', t => {
    t.beforeEach((next) => {
      sandbox.spy(response, 'status')
      sandbox.spy(response, 'json')
      next()
    })

    t.test('should call next with error when recipientRepository.update() yields an error', t => {
      const error = new Error(':(')
      const recipientId = uuid()
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const request = {
        params: {
          id: recipientId
        },
        body: recipient,
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'update').yields(error)

      recipientHandler.handlePut(request, response, next)

      t.ok(next.calledWith(error))
      t.end()
    })

    t.test('should send 200 response containing recipient when recipientRepository.update() yields recipient', t => {
      const recipientId = uuid()
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const request = {
        params: {
          id: recipientId
        },
        body: recipient,
        logger: noOpLogger
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'update').yields(null, recipient)

      recipientHandler.handlePut(request, response, next)

      t.ok(recipientRepository.update.calledWith(request.params.id, request.body, sinon.match.func))
      t.ok(response.status.calledWith(200))
      t.ok(response.json.calledWith(recipient))
      t.end()
    })

    t.end()
  })

  t.test('handleDelete', t => {
    t.beforeEach((next) => {
      sandbox.spy(response, 'sendStatus')
      next()
    })

    t.test('should call next with an error when recipientRepository.delete() yields an error', t => {
      const error = new Error(':(')
      const recipientId = uuid()
      const request = {
        params: {
          id: recipientId
        }
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'delete').yields(error)

      recipientHandler.handleDelete(request, response, next)

      t.ok(next.calledWith(error))
      t.end()
    })

    t.test('should send 204 response when recipientRepository.delete does not yield an error', t => {
      const recipientId = uuid()
      const request = {
        params: {
          id: recipientId
        }
      }
      const next = sandbox.stub()

      sandbox.stub(recipientRepository, 'delete').yields(null)

      recipientHandler.handleDelete(request, response, next)

      t.ok(recipientRepository.delete.calledWith(request.params.id, sinon.match.func))
      t.ok(response.sendStatus.calledWith(204))
      t.end()
    })

    t.end()
  })

  t.end()
})
