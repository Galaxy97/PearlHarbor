const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Admin:simplepass111@cluster0-ogczo.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
// mongoose.connect('mongodb://localhost:27017/data', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('connection error')
})
db.once('open', function () {
  console.log('we\'re connected!')
})

module.exports = db
