const User = require('../user/models/usermodel')
const RequestError = require('../../errors//RequestError')
const cookie = require('cookie')
const Room = require('./models/roomsmodel').Rooms
const Player = require('./models/roomsmodel').Player
const generateFields = require('../../utils/randomgamefield').randomize

const authenticate = (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new RequestError(401, 'User is not logged'))
  }
  const apikey = cookie.parse(req.headers.cookie).apiKey
  User.findOne({ apiKey: apikey },
    function (err, founduser) {
      if (err) {
        return next(new RequestError(400, err))
      }
      if (founduser === null) {
        return next(new RequestError(401, 'User is not logged'))
      }
      next()
    })
}

const updateRoom = (roomId, player, close) => {
  Room.updateOne({ roomId: roomId },
    {
      $push: { players: player },
      isClose: close
    },
    { multi: false }, function (err) {
      if (err) {
        console.error(err)
      }
    })
}

const updateSocketId = (roomId, newSocketId, player) => { // player1 = true ; player2 = false
  let update
  if (player) {
    update = {
      player1socketId: newSocketId
    }
  } else {
    update = {
      player2socketId: newSocketId
    }
  }
  Room.updateOne({ roomId: roomId },
    update,
    { multi: false }, function (err) {
      if (err) {
        console.error(err)
      }
    })
}

const getRoom = (roomId) => {
  return Room.findOne({ roomId: roomId })
}

const createNewRoom = (roomId, player, typeRoom) => {
  Room.create({
    roomId: roomId,
    indexOfCurrentPlayer: 0,
    players: [player],
    typeOfRoom: typeRoom,
    isClose: false,
    winnerApiKey: null,
    retiredPlayers: [-1]
  })
}

const createNewPlayer = (socketId, apiKey, perks) => {
  const data = generateFields()
  return new Player({
    socketId: socketId,
    apiKey: apiKey,
    matrix: data.matrix,
    ships: data.ships,
    shipsStatus: data.shipsStatus,
    enemyField: data.enemyField,
    superWeapon: perks
  })
}

const findFreeRoom = (type) => {
  return Room.findOne({ isClose: false, typeOfRoom: type })
}

const getPlayerInfo = (apiKey) => {
  return User.findOne({ apiKey: apiKey })
}

const checkTurn = (room, socket, turn) => {
  const foundUser = room.players.find(o => o.socketId === socket)
  const index = room.players.indexOf(foundUser)
  if (index === turn) {
    return true
  } else {
    return false
  }
}

const isPlayerPresent = (room, apiKey) => {
  return room.players.find(o => o.apiKey === apiKey)
}

module.exports = {
  authenticate,
  updateRoom,
  createNewRoom,
  createNewPlayer,
  findFreeRoom,
  getPlayerInfo,
  getRoom,
  updateSocketId,
  checkTurn,
  isPlayerPresent
}
