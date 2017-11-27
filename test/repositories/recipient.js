'use strict'

const database = require('../../lib/database')
const NotFoundError = require('../../lib/errors/not-found')
const recipientRepository = require('../../lib/repositories/recipient')
const sinon = require('sinon')
const tap = require('tap')

const recipientCollectionStub = {
  findOne () {
    throw new Error('RecipientCollectionStub.findOne() not stubbed')
  }
}

const dbStub = {
  collection () {
    return recipientCollectionStub
  }
}

tap.test('RecipientRepository', t => {
  const sandbox = sinon.sandbox.create()

  t.afterEach(next => {
    sandbox.restore()
    next()
  })

  t.test('findById', t => {
    t.test('should call callback with an error when connecting to the database yields an error', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(error)

      recipientRepository.findById(recipientId, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with an error when findOne yields an error', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOne').yields(error)

      recipientRepository.findById(recipientId, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with NotFoundError when findOne yields no recipient', t => {
      const recipientId = new ObjectID()
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOne').yields(null, null)

      recipientRepository.findById(recipientId, callback)

      t.ok(callback.calledWith(sinon.match.instanceOf(NotFoundError)))
      t.end()
    })

    t.test('should call callback with recpient when findOne yields a recipient', t => {
      const recipientId = new ObjectID()
      const recipient = {
        id: recipientId
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOne').yields(null, recipient)

      recipientRepository.findById(recipientId, callback)

      t.ok(callback.calledWith(null, recipient))
      t.end()
    })

    t.end()
  })

  t.end()
})
