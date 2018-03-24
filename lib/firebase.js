'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require(process.env.FIREBASE_KEY_PATH)

firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = exports = firebase
