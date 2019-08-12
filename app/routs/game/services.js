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

const updateRoom = (roomId, player2, player2socketId, player2apiKey, close) => {
  Room.updateOne({ roomId: roomId },
    {
      player2: player2,
      player2socketId: player2socketId,
      player2apiKey: player2apiKey,
      isClose: close
    },
    { multi: false }, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('succesfull update')
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
        console.log(err)
      }
      console.log('succesfull update socketID')
    })
}

const getGameRoom = (roomId) => {
  return Room.findOne({ roomId: roomId })
}

const createNewRoom = (roomId, player1, player1apiKey, player1socketId) => {
  Room.create({
    roomId: roomId,
    isFirstPlayerTurn: true,
    player1: player1,
    player2: null,
    player1socketId: player1socketId,
    player2socketId: null,
    player1apiKey: player1apiKey,
    player2apiKey: null,
    isClose: false
  })
}

const createNewPlayer = () => {
  const data = generateFields()
  return new Player({
    matrix: data.matrix,
    ships: data.ships,
    shipsStatus: data.shipsStatus,
    enemyField: data.enemyField,
    superWeapon: ['rowStrike', '4xShot', 'diagonalStrike']
  })
}

const findFreeRoom = () => {
  return Room.findOne({ isClose: false })
}

const getPlayerInfo = (apiKey) => {
  return User.findOne({ apiKey: apiKey })
}

module.exports = {
  authenticate,
  updateRoom,
  createNewRoom,
  createNewPlayer,
  findFreeRoom,
  getPlayerInfo,
  getGameRoom,
  updateSocketId
}
