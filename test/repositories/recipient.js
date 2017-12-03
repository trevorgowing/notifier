'use strict'

const database = require('../../lib/database')
const NotFoundError = require('../../lib/errors/not-found')
const ObjectID = require('mongodb').ObjectID
const recipientRepository = require('../../lib/repositories/recipient')
const sinon = require('sinon')
const tap = require('tap')

const recipientCollectionStub = {
  findOne () {
    throw new Error('RecipientCollectionStub.findOne() not stubbed')
  },
  insertOne () {
    throw new Error('RecipientCollectionStub.insertOne() not stubbed')
  },
  findOneAndReplace () {
    throw new Error('RecipientCollectionStub.findOneAndReplace()  not stubbed')
  },
  deleteOne () {
    throw new Error('RecipientCollectionStub.deleteOne()  not stubbed')
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
        _id: recipientId
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

  t.test('create', t => {
    t.test('should call callback with error when connecting to database fails', t => {
      const error = new Error(':(')
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(error)

      recipientRepository.create(recipient, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with an error when insertOne yields an error', t => {
      const error = new Error(':(')
      const recipient = {
        email: 'trevor@email.com',
        phone: '+278312134567'
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'insertOne').yields(error)

      recipientRepository.create(recipient, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with error when insertOne yields an unsuccessful insert', t => {
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const result = {
        insertedCount: 0,
        ops: []
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'insertOne').yields(null, result)

      recipientRepository.create(recipient, callback)

      t.ok(callback.calledWith(sinon.match.instanceOf(Error)))
      t.end()
    })

    t.test('should call callback with recipient when insertOne yields a successful insert', t => {
      const recipient = {
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const identifiedRecipient = Object.assign({}, {_id: new ObjectID()}, recipient)
      const result = {
        insertedCount: 1,
        ops: [identifiedRecipient]
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'insertOne').yields(null, result)

      recipientRepository.create(recipient, callback)

      t.ok(callback.calledWith(null, identifiedRecipient))
      t.end()
    })

    t.end()
  })

  t.test('update', t => {
    t.test('should call callback with error when connecting to database fails', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const recipient = {
        _id: recipientId,
        email: 'trevor@email.com',
        phone: '+27231234567'
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(error)

      recipientRepository.update(recipientId, recipient, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with error when findOneAndReplace yields an error', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const recipient = {
        _id: recipientId,
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOneAndReplace').yields(error)

      recipientRepository.update(recipientId, recipient, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with a NotFoundError when findOneAndReplace yields no result', t => {
      const recipientId = new ObjectID()
      const recipient = {
        _id: recipientId,
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const result = {
        ok: 1,
        value: null
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOneAndReplace').yields(null, result)

      recipientRepository.update(recipientId, recipient, callback)

      t.ok(callback.calledWith(sinon.match.instanceOf(NotFoundError)))
      t.end()
    })

    t.test('should call callback with recipient when findOneAndReplace yields a successful result', t => {
      const recipientId = new ObjectID()
      const recipient = {
        _id: recipientId,
        email: 'trevor@email.com',
        phone: '+27831234567'
      }
      const result = {
        ok: 1,
        value: recipient
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'findOneAndReplace').yields(null, result)

      recipientRepository.update(recipientId, recipient, callback)

      t.ok(callback.calledWith(null, recipient))
      t.end()
    })

    t.end()
  })

  t.test('delete', t => {
    t.test('should call callback with error when connecting to database fails', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(error)

      recipientRepository.delete(recipientId, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with error when deleteOne yields an error', t => {
      const error = new Error(':(')
      const recipientId = new ObjectID()
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'deleteOne').yields(error)

      recipientRepository.delete(recipientId, callback)

      t.ok(callback.calledWith(error))
      t.end()
    })

    t.test('should call callback with an error when deleteOne yields deletedCount 0', t => {
      const recipientId = new ObjectID()
      const result = {
        deletedCount: 0
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(null, dbStub)
      sandbox.stub(recipientCollectionStub, 'deleteOne').yields(null, result)

      recipientRepository.delete(recipientId, callback)

      t.ok(callback.calledWith(sinon.match.instanceOf(NotFoundError)))
      t.end()
    })

    t.test('should call callback with no arugments when deleteOne yields deltedCount 1', t => {
      const recipientId = new ObjectID()
      const result = {
        deletedCount: 1
      }
      const callback = sandbox.stub()

      sandbox.stub(database, 'connect').yields(dbStub)
      sandbox.stub(recipientCollectionStub, 'deleteOne').yields(result)

      recipientRepository.delete(recipientId, callback)

      t.ok(callback.calledOnce)
      t.end()
    })

    t.end()
  })

  t.end()
})
