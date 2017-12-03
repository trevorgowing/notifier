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

exports.create = (recipient, callback) => {
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

exports.update = (id, recipient, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    const query = {_id: id}
    const options = {upsert: true, returnOriginal: false}
    db.collection('recipients').findOneAndReplace(query, recipient, options, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.value) {
        return callback(null, result.value)
      } else {
        return callback(new NotFoundError(`No recipient found for id ${id}`))
      }
    })
  })
}

exports.delete = (id, callback) => {
  database.connect((error, db) => {
    if (error) {
      return callback(error)
    }

    db.collection('recipients').deleteOne({_id: id}, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.deletedCount) {
        return callback()
      } else {
        return callback(new NotFoundError(`No recipient found  for id ${id}`))
      }
    })
  })
}
