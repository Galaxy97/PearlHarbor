const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')
const generateField = require('./randomgamefield').randomize
const checkHit = require('./checkHit').checkHit
const isFinishGame = require('./checkHit').isFinishGame
const updateBase = require('./../routs/user/services').updateBase

const rooms = {
}

module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('authentication', (data) => {
      User.findOne(
        {
          apiKey: data.apiKey
        })
        .then((user) => {
          const idS = Object.keys(rooms)
          console.log('idS', idS)
          let roomId = idS.find((element) => {
            console.log(rooms[element].close)
            return rooms[element].close === false
          })
          // let roomId
          if (roomId) {
            console.log(rooms[roomId])
            rooms[roomId].close = true
            rooms[roomId].player2 = {
              apiKey: data.apiKey,
              name: user.name,
              sessions: user.sessions,
              wins: user.wins,
              lastPlayDate: user.updatedAt
            }

            socket.emit('messeage', rooms[roomId])
            socket.join(roomId)
            battle(io, roomId, socket)
          } else {
            roomId = uuidv4()
            rooms[roomId] = {
              roomId: roomId,
              close: false,
              player1: {
                apiKey: data.apiKey,
                name: user.name,
                sessions: user.sessions,
                wins: user.wins,
                lastPlayDate: user.updatedAt
              }
            }
            socket.join(roomId)
            console.log('rooms.roomId', rooms[roomId])
            socket.emit('messeage', rooms[roomId])
          }
          console.log('user fron db', user.name)
        })
        .catch((e) => {
          console.log(e)
        })
    })

    socket.on('shot', (data) => {
      console.log('shot to', data.idX, data.idY)
      const gameStats = rooms[data.roomId].gameStats
      if (gameStats.isContinue === false) {
        console.log('FINISH GG WP')
      }
      if (socket.id === gameStats.player1.id && gameStats.turn === true) {
        console.log('player 1 your shot')
        if (!checkHit(data.idX, data.idY, gameStats.player1, gameStats.player2, '4xShot')) {
          gameStats.turn = false
        }
        if (isFinishGame(gameStats.player2)) {
          console.log('won')
          io.to(data.roomId).emit('won', rooms[data.roomId].player2.name)
          updateBase(rooms[data.roomId].player1, 1)
          updateBase(rooms[data.roomId].player2, 0)
          commitEnd(data.roomId)
        }
        socket.emit('shotResult', gameStats.player1.enemyField)
        socket.broadcast.to(gameStats.player2.id).emit('getUserField', gameStats.player2.matrix)
      } else if (socket.id === gameStats.player2.id && gameStats.turn === false) {
        console.log('player 2 your shot')
        if (!checkHit(data.idX, data.idY, gameStats.player2, gameStats.player1, 'rowStrike')) {
          gameStats.turn = true
        }
        if (isFinishGame(gameStats.player1)) {
          console.log('won v2')
          io.to(data.roomId).emit('won', rooms[data.roomId].player2.name)
          updateBase(rooms[data.roomId].player1, 0)
          updateBase(rooms[data.roomId].player2, 1)
          commitEnd(data.roomId)
        }
        socket.emit('shotResult', gameStats.player2.enemyField)
        socket.broadcast.to(gameStats.player1.id).emit('getUserField', gameStats.player1.matrix)
      } else {
        console.log('unknown player ERRRRROOOORR', socket.id, 'player1', gameStats.player1.id, 'player2', gameStats.player2.id, gameStats.turn)
      }
    })

    socket.on('getMyFileld', (roomId) => {
      if (socket.id === rooms[roomId].gameStats.player1.id) {
        console.log('player 1 your shot')
        socket.emit('getUserField', rooms[roomId].gameStats.player1.matrix)
      } else if (socket.id === rooms[roomId].gameStats.player2.id) {
        console.log('player 2 your shot')
        socket.emit('getUserField', rooms[roomId].gameStats.player2.matrix)
      } else {
        console.log('unknown USER FIELD player ERRRRROOOORR')
      }
    })

    console.log('successful connection to socket')
    socket.on('disconnect', function () {
      console.log('Unconnection <--')
    })
  })
}

function battle (io, roomId, socket) {
  const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
  socket.broadcast.to(arr[0]).emit('infoPlayer2', rooms[roomId].player2) // arr[0] = socket.id player 1
  rooms[roomId].gameStats = {
    turn: false,
    player1: generateField(arr[0]),
    player2: generateField(arr[1])
  }
  io.to(roomId).emit('letsBattle')
}

function commitEnd (roomId) {
  delete rooms.roomId
}
