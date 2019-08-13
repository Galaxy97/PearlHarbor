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
  Players: {
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

const tripleRoom = mongoose.Schema({
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
  player3: {
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
  player3socketId: {
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
  player3apiKey: {
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
const TripleRooms = mongoose.model('TripleRooms', tripleRoom)
module.exports = { Rooms, Player, TripleRooms }
