'use strict'

const database = require('../database')
const NotFoundError = require('../errors/not-found')

exports.findById = (id, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('recipients').findOne({_id: id}, (error, recipient) => {
      if (error) {
        return callback(error)
      }

      if (recipient) {
        return callback(null, recipient)
      } else {
        callback(new NotFoundError(`No recipient found for id ${id}`))
      }
    })
  })
}

exports.save = (recipient, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('recipients').insertOne(recipient, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.insertedCount) {
        return callback(null, result.ops[0])
      } else {
        return callback(new Error(`Creation of ${recipient} unsuccessful`))
      }
    })
  })
}
