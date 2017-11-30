'use strict'

const EventEmitter = require('events')
const {MongoClient} = require('mongodb')

const emmitter = new EventEmitter()
const CONNECTED_EVENT_NAME = 'connected'
const ERROR_EVENT_NAME = 'error'

const options = {
  appname: 'notifier',
  w: 'majority',
  j: true,
  readConcern: {level: 'majority'},
  readPreference: 'primaryPreferred'
}

let db = null
let connecting = false

exports.connect = (callback) => {
  if (db) {
    return callback(null, db)
  } else {
    waitForConnection(callback)
    attemptConnection()
  }
}

exports.close = () => {
  if (db) {
    db.close()
  }
}

function waitForConnection (callback) {
  emmitter.once(CONNECTED_EVENT_NAME, (connectedDb) => {
    db = connectedDb
    callback(null, db)
  })
  emmitter.once(ERROR_EVENT_NAME, callback)
}

function attemptConnection () {
  if (!connecting) {
    connecting = true
    MongoClient.connect(process.env.DATABASE_URL, options, handleConnection)
  }
}

function handleConnection (error, db) {
  if (error) {
    emmitter.emit(ERROR_EVENT_NAME, error)
  } else {
    emmitter.emit(CONNECTED_EVENT_NAME, db)
  }
  emmitter.removeAllListeners()
  connecting = false
}
