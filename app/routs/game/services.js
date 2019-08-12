const User = require('../user/models/usermodel')
const RequestError = require('../../errors//RequestError')
const cookie = require('cookie')
const Room = require('./models/roomsmodel').Rooms
const Player = require('./models/roomsmodel').Player

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

const saveToDataBase = (room, roomId, close, winner) => {
  Room.findOne({ roomId: roomId })
    .then((foundRoom) => {
      const player1 = new Player({
        matrix: room.gameStats.player1.matrix,
        ships: room.gameStats.player1.ships,
        shipsStatus: room.gameStats.player1.shipsStatus,
        enemyField: room.gameStats.player1.enemyField
      })
      const player2 = new Player({
        matrix: room.gameStats.player2.matrix,
        ships: room.gameStats.player2.ships,
        shipsStatus: room.gameStats.player2.shipsStatus,
        enemyField: room.gameStats.player2.enemyField
      })
      if (foundRoom === null) {
        new Room({
          roomId: roomId,
          isFirstPlayerTurn: room.gameStats.turn,
          player1: player1,
          player2: player2,
          player1socketId: room.gameStats.player1.id,
          player2socketId: room.gameStats.player2.id,
          player1apiKey: room.player1.apiKey,
          player2apiKey: room.player2.apiKey,
          createdAt: new Date(),
          isClose: close,
          winnerApiKey: winner
        }).save()
          .then(() => {
            console.log('game saved')
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        foundRoom.update({
          isFirstPlayerTurn: room.gameStats.turn,
          player1: player1,
          player2: player2,
          player1socketId: room.gameStats.player1.id,
          player2socketId: room.gameStats.player2.id,
          player1apiKey: room.player1.apiKey,
          player2apiKey: room.player2.apiKey,
          createdAt: new Date(),
          isClose: close,
          winnerApiKey: winner
        })
          .then(() => {
            console.log('upd')
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
}

const getFromDataBase = (room, roomId, player1, player2) => {

}

module.exports = { authenticate, saveToDataBase, getFromDataBase }
