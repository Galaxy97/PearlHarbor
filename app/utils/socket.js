const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')
const generateField = require('./randomgamefield').randomize
const checkHit = require('./randomgamefield').checkHit

const roomEneny = []
const fields = {}

module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('authentication', (data) => {
      User.findOne(
        {
          apiKey: data.apiKey
        })
        .then((user) => {
          console.log('user fron db', user.name)
          socket.emit('messeage', {
            name: user.name,
            sessions: user.sessions,
            wins: user.wins,
            lastPlayDate: user.updatedAt
          })
        })
        .catch((e) => {
          console.log(e)
        })
      let roomId
      console.log('room', roomId)
      if (roomEneny.length) {
        InitializeFields()
        checkHit(1, 1, fields.player1, fields.player2)
        roomId = roomEneny[0] // next wiil be random
        roomEneny.pop()
        socket.join(roomId)
        io.to(roomId).emit('letsBattle')
        var room = io.sockets.adapter.rooms[roomId].sockets
      } else {
        roomId = uuidv4()
        roomEneny.push(roomId)
        socket.join(roomId)
      }
    })
    console.log('successful connection to socket')
    socket.on('disconnect', function () {
      console.log('Unconnection <--')
    })
  })
}

function InitializeFields () {
  fields.player1 = generateField()
  fields.player2 = generateField()
}
