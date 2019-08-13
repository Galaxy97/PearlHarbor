const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')

const checkHit = require('./checkHit').checkHit
const isFinishGame = require('./checkHit').isFinishGame
const updateBase = require('./../routs/user/services').updateBase
const saveToDataBase = require('./../routs/game/services').saveToDataBase
const createNewRoom = require('../routs/game/services').createNewRoom

const services = {
  game: require('./../routs/game/services'),
  user: require('./../routs/user/services')
}

module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('authentication', (data) => {
      User.findOne(
        {
          apiKey: data.apiKey
        })
        .then((user) => {
          const roomType = Number(socket.handshake.query.roomType)
          services.game.findFreeRoom(roomType)
            .then((roomData) => {
              if (roomData) {
                socket.join(roomData.roomId)
                const player = services.game.createNewPlayer(user.perks, socket.id, data.apiKey)
                const room = {
                  roomId: roomData.roomId,
                  yourTurn: true,
                  player: player
                }
                socket.emit('message', room)
                if (roomData.Players.length === roomType - 1) {
                  services.game.updateRoom(roomData.roomId, player, true)
                  battle(io, roomData.roomId)
                } else {
                  services.game.updateRoom(roomData.roomId, player, false)
                }
              } else {
                const roomId = uuidv4()
                const player = services.game.createNewPlayer(user.perks, socket.id, data.apiKey)
                createNewRoom(roomId, player, roomType)
                socket.join(roomId)
                const room = {
                  roomId: roomId,
                  yourTurn: true,
                  player: player
                }
                socket.emit('message', room)
              }
            })
            .catch((e) => {
              console.log('error', e)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    })

    // socket.on('recovery', (data) => {
    //   services.game.getGameRoom(data.roomId)
    //     .then((room) => {
    //       if (data.playerId === room.player1socketId) {
    //         socket.emit('userRecovery', {
    //           playerField: room.player1.matrix,
    //           enemyField: room.player1.enemyField,
    //           superWeapon: room.player1.superWeapon,
    //           turn: room.isFirstPlayerTurn
    //         })
    //         services.game.updateSocketId(data.roomId, socket.id, true) // player1 = true ; player2 = false
    //       } else if (data.playerId === room.player2socketId) {
    //         socket.emit('userRecovery', {
    //           playerField: room.player2.matrix,
    //           enemyField: room.player2.enemyField,
    //           superWeapon: room.player2.superWeapon,
    //           turn: !room.isFirstPlayerTurn
    //         })
    //         services.game.updateSocketId(data.roomId, socket.id, false) // player1 = true ; player2 = false
    //       }
    //     })
    //     .catch((e) => {
    //       console.log(e)
    //     })
    //   socket.emit('playerId', socket.id)
    // })

    socket.on('shot', (data) => {
      services.game.getGameRoom(data.roomId)
        .then((room) => {
          if (services.game.checkTurn(room, socket.id, room.indexOfCurrentPlayer)) {
            if (data.option) {
              room.Players[room.indexOfCurrentPlayer].superWeapon.splice(room.Players[room.indexOfCurrentPlayer].superWeapon.indexOf(data.option), 1)
            }
            let player2 = room.indexOfCurrentPlayer + 1
            if (room.indexOfCurrentPlayer === room.typeOfRoom - 1) {
              player2 = 0
            }
            if (!checkHit(data.idX, data.idY, room.Players[room.indexOfCurrentPlayer], room.Players[player2], data.option)) {
              if (room.indexOfCurrentPlayer === room.typeOfRoom - 1) {
                room.indexOfCurrentPlayer = 0
              } else {
                room.indexOfCurrentPlayer++
              }
            }
            if (isFinishGame(room.Players)) {
              console.log('won')
              io.to(data.roomId).emit('won', 'lol')
            }
            room.markModified(`Players`)
            room.save()
              .then(() => {
                console.log('ok')
              })
              .catch((err) => {
                console.log(err)
              })
            socket.emit('shotResult', room.Players[room.indexOfCurrentPlayer].enemyField, room.indexOfCurrentPlayer)
            socket.broadcast.to(room.Players[player2].socketId).emit('updateUserField', room.Players[player2].matrix, room.indexOfCurrentPlayer)
          } else {
            console.log('bad click')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    })

    console.log('successful connection to socket', socket.id)
    socket.on('disconnect', function () {
      console.log('Unconnection <--', socket.id)
    })
  })
}

function battle (io, roomId) {
  io.to(roomId).emit('letsBattle')
}
