const mongoose = require('mongoose')

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
  },
  registeredAt: {
    type: Date,
    require: true
  }
})

var User = mongoose.model('User', user)
module.exports = User
