const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const player = mongoose.Schema({
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
  }
})

const rooms = mongoose.Schema({
  roomId: {
    type: String,
    require: true
  },
  isFirstPlayerTurn: {
    type: Boolean,
    require: true
  },
  player1: {
    type: player,
    require: true
  },
  player2: {
    type: player,
    require: true
  },
  player1socketId: {
    type: String,
    require: true
  },
  player2socketId: {
    type: String,
    require: true
  },
  player1apiKey: {
    type: String,
    require: true
  },
  player2apiKey: {
    type: String,
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
