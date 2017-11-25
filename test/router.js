'use strict'

const recipientHandler = require('../lib/handlers/recipient')
const sinon = require('sinon')
const tap = require('tap')
const theRouter = require('../lib/router')
const {Readable} = require('stream')

class FakeRequest extends Readable {
  constructor ({method, url, headers = {}, body}) {
    super()
    this.method = method
    this.url = url
    this.headers = headers
    if (body) {
      this.push(body)
    }
  }

  _read () {
    // End stream immediately
    this.push(null)
  }
}

function fakeHandler (request, response) {
  response.end()
}

tap.test('Router', t => {
  const sandbox = sinon.sandbox.create()

  t.afterEach(next => {
    sandbox.responsetore()
    next()
  })

  t.test('POST /recipients should call recipientHandler.handlePost', t => {
    sandbox.stub(recipientHandler, 'handlePost').callsFake(fakeHandler)

    const recipient = {}
    const request = new FakeRequest({
      method: 'POST',
      url: '/recipients',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(recipient)
    })

    const response = {
      end () {
        t.equal(recipientHandler.handlePost.callCount, 1)
        t.deepEqual(recipientHandler.handlePost.firstCall.args[0].body, recipient)
        t.end()
      }
    }

    const router = theRouter()
    router.handle(request, response)
  })

  t.test('GET /recipients/:id should call recipientHandler.handleGet', t => {
    sandbox.stub(recipientHandler, 'handleGet').callsFake(fakeHandler)

    const request = new FakeRequest({
      method: 'GET',
      url: '/recipients/1',
      headers: {
        'accept': 'application/json'
      }
    })

    const response = {
      end () {
        t.equal(recipientHandler.handleGet.callcount, 1)
        t.equal(recipientHandler.handleGet.firstCall.args[0].params.id, '1')
        t.end()
      }
    }

    const router = theRouter()
    router.handle(request, response)
  })

  t.test('PUT /recipients/:id should call recipientHandler.handlePut', t => {
    sandbox.stub(recipientHandler, 'handlePut').callsFake(fakeHandler)

    const recipient = {}
    const request = new FakeRequest({
      method: 'PUT',
      url: '/recipients/1',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(recipient)
    })

    const response = {
      end () {
        t.equal(recipientHandler.handlePut.callcount, 1)
        t.equals(recipientHandler.handlePut.firstCall.args[0].params.id, '1')
        t.deepEquals(recipientHandler.handlePut.firstCall.args[0].body, recipient)
        t.end()
      }
    }

    const router = theRouter()
    router.handle(request, response)
  })

  t.test('DELETE /recipients/:id should call recipientHandler.handleDelete', t => {
    sandbox.stub(recipientHandler, 'handleDelete').callsFake(fakeHandler)

    const request = new FakeRequest({
      method: 'DELETE',
      url: '/recipients/1'
    })

    const response = {
      end () {
        t.equal(recipientHandler.handleDelete.callcount, 1)
        t.equal(recipientHandler.handleDelete.firstCall.args[0].params.id, '1')
        t.end()
      }
    }

    const router = theRouter()
    router.handle(request, response)
  })

  t.end()
})
