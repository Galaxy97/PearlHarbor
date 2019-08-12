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
          // find free room
          services.game.findFreeRoom()
            .then((roomData) => {
              console.log('roomData is', roomData)
              if (roomData) {
                // if free room is exsist this player 2 and start game
                socket.join(roomData.roomId)
                const player = services.game.createNewPlayer()
                const room = {
                  roomId: roomData.roomId,
                  yourTurn: false,
                  player: player, // fiels for game player 2
                  player1Info: null, // info about player 1
                  player2Info: {
                    apiKey: data.apiKey,
                    name: user.name,
                    sessions: user.sessions,
                    wins: user.wins,
                    lastPlayDate: user.updatedAt
                  }
                }
                services.game.getPlayerInfo(roomData.player1apiKey) // call to database
                  .then((info) => {
                    console.log('infoooo', info)
                    room.player1Info = info
                    socket.emit('messeage', room) // send playerInfo
                    socket.join(roomData.roomId)
                    battle(io, roomData.roomId, socket, player, room.player2Info, data.apiKey)
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              } else { // this player 1
                // create new room
                const roomId = uuidv4()
                const player = services.game.createNewPlayer()
                const room = {
                  roomId: roomId,
                  yourTurn: true,
                  player: player, // fiels for game
                  player1Info: {
                    apiKey: data.apiKey,
                    name: user.name,
                    sessions: user.sessions,
                    wins: user.wins,
                    lastPlayDate: user.updatedAt
                  }
                }
                createNewRoom(roomId, player, data.apiKey, socket.id) // create new room in database
                socket.join(roomId)
                socket.emit('messeage', room)
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

    socket.on('recovery', (data) => {
      services.game.getGameRoom(data.roomId)
        .then((room) => {
          console.log(room)
          if (data.playerId === room.player1socketId) {
            socket.emit('userRecovery', {
              playerField: room.player1.matrix,
              enemyField: room.player1.enemyField,
              superWeapon: room.player1.superWeapon,
              turn: room.isFirstPlayerTurn
            })
            services.game.updateSocketId(data.roomId, socket.id, true) // player1 = true ; player2 = false
          } else if (data.playerId === room.player2socketId) {
            socket.emit('userRecovery', {
              playerField: room.player2.matrix,
              enemyField: room.player2.enemyField,
              superWeapon: room.player2.superWeapon,
              turn: !room.isFirstPlayerTurn
            })
            services.game.updateSocketId(data.roomId, socket.id, false) // player1 = true ; player2 = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
      socket.emit('playerId', socket.id)
    })

    socket.on('shot', (data) => {
      console.log('shot to', data.idX, data.idY)
      services.game.getGameRoom(data.roomId)
        .then((room) => {
          console.log(room)
          if (socket.id === room.player1socketId) {
            if (data.option) {
              room.player1.superWeapon.splice(room.player1.superWeapon.indexOf(data.option), 1)
            }
            if (!checkHit(data.idX, data.idY, room.player1, room.player2, data.option)) {
              room.isFirstPlayerTurn = false
              // call func write to db
            }
            if (isFinishGame(room.player2)) {
              console.log('won')
              io.to(data.roomId).emit('won', 'lol')
              commitEnd(data.roomId)
            }
            socket.emit('shotResult', room.player1.enemyField, room.isFirstPlayerTurn)
            socket.broadcast.to(room.player2socketId).emit('updateUserField', room.player2.matrix, !room.isFirstPlayerTurn)
          } else if (socket.id === room.player2socketId) {
            if (data.option) {
              room.player2.superWeapon.splice(room.player2.superWeapon.indexOf(data.option), 1)
            }
            if (!checkHit(data.idX, data.idY, room.player2, room.player1, data.option)) {
              room.isFirstPlayerTurn = true
              // call func write to db
            }
            if (isFinishGame(room.player1)) {
              console.log('won')
              io.to(data.roomId).emit('won', 'lol')
              commitEnd(data.roomId)
            }
            socket.emit('shotResult', room.player2.enemyField, room.isFirstPlayerTurn)
            socket.broadcast.to(room.player1socketId).emit('updateUserField', room.player1.matrix, !room.isFirstPlayerTurn)
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

function battle(io, roomId, socket, player, player2Info, apiKey) {
  services.game.updateRoom(roomId, player, socket.id, apiKey, true) // close this room for new connections
  const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
  socket.broadcast.to(arr[0]).emit('infoPlayer2', player2Info)
  socket.broadcast.to(arr[0]).emit('playerId', arr[0]) // arr[0] = socket.id player 1
  socket.emit('playerId', arr[1]) // arr[1] = socket.id player 2

  io.to(roomId).emit('letsBattle')
}

function commitEnd(roomId) {
  delete rooms[roomId]
}
