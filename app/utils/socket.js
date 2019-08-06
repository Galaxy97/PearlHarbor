const User = require('../routs/user/models/usermodel')
const uuidv4 = require('uuid/v4')

const roomEneny = []

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
        roomId = roomEneny[0] // next wiil be random
        roomEneny.pop()
        socket.join(roomId)
        io.to(roomId).emit('hello')
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
