const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const player = mongoose.Schema({
  socketId: {
    type: String,
    require: true
  },
  apiKey: {
    type: String,
    require: true
  },
  matrix: {
    type: [[Number]],
    require: true
  },
  ships: {
    type: [mongoose.Mixed],
    require: true
  },
  shipsStatus: {
    type: [Boolean],
    require: true
  },
  enemyField: {
    type: [[Number]],
    require: true
  },
  superWeapon: {
    type: [String],
    require: true
  }
})

const rooms = mongoose.Schema({
  roomId: {
    type: String,
    require: true
  },
  indexOfCurrentPlayer: {
    type: Number,
    require: true
  },
  players: {
    type: [player],
    require: true
  },
  typeOfRoom: {
    type: Number,
    require: true
  },
  isClose: {
    type: Boolean,
    require: false
  },
  winnerApiKey: {
    type: String,
    require: false
  },
  createdAt: {
    type: Date,
    require: true
  }
})

const Player = mongoose.model('Player', player)
const Rooms = mongoose.model('Rooms', rooms)
module.exports = { Rooms, Player }
