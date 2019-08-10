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

    // socket.on('recovery', (data) => {
    //   if (rooms[data.roomId].gameStats.player1.id === data.playerId) {
    //     rooms[data.roomId].gameStats.player1.id = socket.id
    //     socket.emit('shotResult', rooms[data.roomId].gameStats.player1.enemyField)
    //   } else if (rooms[data.roomId].gameStats.player2.id === data.playerId) {
    //     rooms[data.roomId].gameStats.player2.id = socket.id
    //     socket.emit('shotResult', rooms[data.roomId].gameStats.player2.enemyField)
    //   }
    //   socket.emit('playerId', socket.id)
    // })

    socket.on('shot', (data) => {
      console.log('shot to', data.idX, data.idY)
      const gameStats = rooms[data.roomId].gameStats
      if (socket.id === gameStats.player1.id && gameStats.turn === true) {
        console.log('player 1 your shot')
        if (data.option) {
          gameStats.player1.superWeapon.splice(gameStats.player1.superWeapon.indexOf(data.option), 1)
        }
        if (!checkHit(data.idX, data.idY, gameStats.player1, gameStats.player2, data.option)) {
          gameStats.turn = false
        }
        if (isFinishGame(gameStats.player2)) {
          console.log('won')
          io.to(data.roomId).emit('won', rooms[data.roomId].player2.name)
          updateBase(rooms[data.roomId].player1, 1)
          updateBase(rooms[data.roomId].player2, 0)
          saveToDataBase(rooms[data.roomId], data.roomId, true, rooms[data.roomId].player1.apiKey)
          commitEnd(data.roomId)
        }
        saveToDataBase(rooms[data.roomId], data.roomId, false)
        socket.emit('shotResult', gameStats.player1.enemyField, gameStats.turn)
        socket.broadcast.to(gameStats.player2.id).emit('getUserField', gameStats.player2.matrix, !gameStats.turn)
      } else if (socket.id === gameStats.player2.id && gameStats.turn === false) {
        if (!checkHit(data.idX, data.idY, gameStats.player2, gameStats.player1, data.option)) {
          gameStats.turn = true
        }
        if (data.option) {
          gameStats.player2.superWeapon.splice(gameStats.player2.superWeapon.indexOf(data.option), 1)
        }
        if (isFinishGame(gameStats.player1)) {
          io.to(data.roomId).emit('won', rooms[data.roomId].player2.name)
          updateBase(rooms[data.roomId].player1, 0)
          updateBase(rooms[data.roomId].player2, 1)
          saveToDataBase(rooms[data.roomId], data.roomId, true, rooms[data.roomId].player2.apiKey)
          commitEnd(data.roomId)
        }
        saveToDataBase(rooms[data.roomId], data.roomId, false)
        socket.emit('shotResult', gameStats.player2.enemyField, !gameStats.turn)
        socket.broadcast.to(gameStats.player1.id).emit('getUserField', gameStats.player1.matrix, gameStats.turn)
      } else {
        console.log('unknown player ERRRRROOOORR', socket.id, 'player1', gameStats.player1.id, 'player2', gameStats.player2.id, gameStats.turn)
      }
    })

    socket.on('getMyFileld', (roomId) => {
      if (socket.id === rooms[roomId].gameStats.player1.id) {
        console.log('player 1 your shot')
        socket.emit('getUserField', rooms[roomId].gameStats.player1.matrix, true, rooms[roomId].gameStats.player1.superWeapon)
      } else if (socket.id === rooms[roomId].gameStats.player2.id) {
        console.log('player 2 your shot')
        socket.emit('getUserField', rooms[roomId].gameStats.player2.matrix, false, rooms[roomId].gameStats.player2.superWeapon)
      } else {
        console.log('unknown USER FIELD player ERRRRROOOORR')
      }
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
