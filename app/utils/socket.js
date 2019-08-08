const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')
const generateField = require('./randomgamefield').randomize
const checkHit = require('./randomgamefield').checkHit
const isFinishGame = require('./randomgamefield').isFinishGame

const roomEnemy = {
  roomId: null
}

const gameStats = {
  turn: false,
  player1: {},
  player2: {},
  isContinue: true
}

module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('authentication', (data) => {
      User.findOne(
        {
          apiKey: data.apiKey
        })
        .then((user) => {
          console.log('user fron db', user.name)
          if (roomEnemy.player1 !== undefined) {
            roomEnemy.player2 = {
              name: user.name,
              sessions: user.sessions,
              wins: user.wins,
              lastPlayDate: user.updatedAt
            }
          } else {
            roomEnemy.player1 = {
              name: user.name,
              sessions: user.sessions,
              wins: user.wins,
              lastPlayDate: user.updatedAt
            }
          }
          socket.emit('messeage', roomEnemy)
          let roomId
          if (roomEnemy.roomId !== null) {
            roomId = roomEnemy.roomId // next wiil be random
            socket.join(roomId)
            battle(io, roomId, socket)
          } else {
            roomId = uuidv4()
            roomEnemy.roomId = roomId
            socket.join(roomId)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    })

    socket.on('shot', (data) => {
      console.log('shot to', data.idX, data.idY)
      if (gameStats.isContinue === false) {
        console.log('FINISH GG WP')
      }
      if (socket.id === gameStats.player1.id && gameStats.turn === true) {
        console.log('player 1 your shot')
        if (!checkHit(data.idX, data.idY, gameStats.player1, gameStats.player2)) {
          gameStats.turn = false
        }
        if (isFinishGame(gameStats.player2)) {
          console.log('won')
          socket.broadcast.to(gameStats.player1.id).emit('won', roomEnemy.player1.name)
          commitEnd()
        }
        socket.emit('shotResult', gameStats.player1.enemyField)
        socket.broadcast.to(gameStats.player2.id).emit('getUserField', gameStats.player2.matrix)
      } else if (socket.id === gameStats.player2.id && gameStats.turn === false) {
        console.log('player 2 your shot')
        if (!checkHit(data.idX, data.idY, gameStats.player2, gameStats.player1)) {
          gameStats.turn = true
        }
        if (isFinishGame(gameStats.player1)) {
          console.log('won v2')
          io.to(roomEnemy.roomId).emit('won', roomEnemy.player2.name)
          commitEnd()
        }
        socket.emit('shotResult', gameStats.player2.enemyField)
        socket.broadcast.to(gameStats.player1.id).emit('getUserField', gameStats.player1.matrix)
      } else {
        console.log('unknown player ERRRRROOOORR')
      }
    })

    socket.on('getMyFileld', () => {
      if (socket.id === gameStats.player1.id) {
        console.log('player 1 your shot')
        socket.emit('getUserField', gameStats.player1.matrix)
      } else if (socket.id === gameStats.player2.id) {
        console.log('player 2 your shot')
        socket.emit('getUserField', gameStats.player2.matrix)
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
  if (roomEnemy.player2 !== undefined) {
    const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
    socket.broadcast.to(gameStats.player1.id).emit('infoPlayer2', roomEnemy.player2)
    gameStats.player1 = generateField(arr[0])
    gameStats.player2 = generateField(arr[1])
  }
  io.to(roomId).emit('letsBattle')
}

function commitEnd () {
  roomEnemy.roomId = null
  roomEnemy.player1 = undefined
  roomEnemy.player2 = undefined
}
