const mongoose = require('mongoose')

mongoose.connect('mongodb://mongodatabase:27017/data', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('connection error')
})
db.once('open', function () {
  console.log('we\'re connected!')
})

module.exports = db
