const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')

const roomEnemy = {
  roomId: null
}

const gameStats = {
  turn: false,
  player1: {},
  player2: {}
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
            roomEnemy.roomId = null
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
      let player
      console.log('shot to', data.idX, data.idY)
      if (socket.id === gameStats.player1.id) {
        console.log('player 1 your shot')
      } else if (socket.id === gameStats.player2.id) {
        console.log('player 2 your shot')
      } else {
        console.log('unknown player ERRRRROOOORR')
      }
    })

    console.log('successful connection to socket')
    socket.on('disconnect', function () {
      console.log('Unconnection <--')
    })
  })
}

function battle(io, roomId, socket) {
  if (roomEnemy.player2 !== undefined) {
    const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
    gameStats.player1.id = arr[0]
    gameStats.player2.id = arr[1]
    socket.broadcast.to(gameStats.player1.id).emit('infoPlayer2', roomEnemy.player2)
    roomEnemy.player1 = undefined
    roomEnemy.player2 = undefined
  }
  io.to(roomId).emit('letsBattle')
}
