'use strict'

const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})

exports.send = (args, callback) => {
  nexmo.message.sendSms(args.from, args.to, args.message, (error, response) => {
    if (error) {
      return callback(new Error(error))
    }
    return callback(null, response)
  })
}
