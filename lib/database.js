'use strict'

const {MongoClient} = require('mongodb')

function connect ({db: url, options}, callback) {
  MongoClient.connect(url, options, (err, db) => {
    if (err) {
      return callback(err)
    }

    callback(null, db)
  })
}

module.exports = exports = {
  connect
}
