'use strict'

const database = require('../../database')
const ObjectID = require('mongodb').ObjectID
const NotFoundError = require('../errors/not-found')

exports.find = (recipientId, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('messages').find({recipientId: new ObjectID(recipientId)}).toArray((error, messages) => {
      if (error) {
        return callback(error)
      }

      return callback(null, messages)
    })
  })
}

exports.findById = (id, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('messages').findOne({_id: new ObjectID(id)}, (error, message) => {
      if (error) {
        return callback(error)
      }

      if (message) {
        return callback(null, message)
      } else {
        return callback(new NotFoundError(`No message found for id ${id}`))
      }
    })
  })
}

exports.create = (message, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('messages').insertOne(message, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.insertedCount) {
        return callback(null, result.ops[0])
      } else {
        return callback(new Error(`Creation of ${message} unsuccessful`))
      }
    })
  })
}
