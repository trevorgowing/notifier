'use strict'

const database = require('../database')
const NotFoundError = require('../errors/not-found')

exports.findById = (id, callback) => {
  database.connect(process.env.DATABASE_URL, (error, db) => {
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
