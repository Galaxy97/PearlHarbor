const mongoose = require('mongoose')
require('events').EventEmitter.defaultMaxListeners = 25

mongoose.connect('mongodb+srv://Admin:simplepass111@cluster0-ogczo.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('connection error')
})
db.once('open', function () {
  console.log('we\'re connected!')
})
db.on('close', () => {
  db.removeAllListeners()
})

module.exports = db
