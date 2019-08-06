const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')

let roomEnemy = {
  roomId: null
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
          if (roomEnemy.player2 !== undefined) {
            roomEnemy.player1 = undefined
            roomEnemy.player2 = undefined
          }
        })
        .catch((e) => {
          console.log(e)
        })
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
    console.log('successful connection to socket')
    socket.on('disconnect', function () {
      console.log('Unconnection <--')
    })
  })
}

function battle(io, roomId, socket) {
  // const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
  // const player1 = arr[0]
  // const player2 = arr[1]
  // socket.broadcast.to(player1).emit('hello', 'for your eyes only')
  io.to(roomId).emit('letsBattle')
}
