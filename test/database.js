'use strict'

const database = require('../lib/database')
const tap = require('tap')

tap.test('Database', t => {
  t.test('parallel connections should yield the same db', t => {
    let dbOne = null
    let dbTwo = null

    // Attempt two parallel connections to database
    database.connect((error, db) => {
      if (error) {
        throw error
      }

      dbOne = db
      t.ok(dbOne)
    })
    database.connect((error, db) => {
      if (error) {
        throw error
      }

      dbTwo = db
      t.ok(dbTwo)
    })

    // Listen for connection event and validate connections received the same db
    database.connect((error) => {
      if (error) {
        throw error
      }

      t.equals(dbOne, dbTwo)

      dbOne.close()
      t.end()
    })
  })

  t.test('serial connections should yield the same db', t => {
    database.connect((errorOne, dbOne) => {
      if (errorOne) {
        throw errorOne
      }

      t.ok(dbOne)

      database.connect((errorTwo, dbTwo) => {
        if (errorTwo) {
          throw errorTwo
        }

        t.ok(dbTwo)
        t.equal(dbOne, dbTwo)

        dbOne.close()
        t.end()
      })
    })
  })

  t.end()
})
