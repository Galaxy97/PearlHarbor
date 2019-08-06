const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const user = mongoose.Schema({
  id: {
    type: String,
    require: true
  },
  name: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  sessions: {
    type: Number
  },
  wins: {
    type: Number
  },
  apiKey: {
    type: String,
    require: true
  }
}, {
  timestamps: { createdAt: 'createdAt' }
})

var User = mongoose.model('User', user)
module.exports = User
