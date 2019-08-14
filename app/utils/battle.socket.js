const checkHit = require('./checkHit').checkHit
const isFinishGame = require('./checkHit').isFinishGame
const services = {
  game: require('./../routs/game/services'),
  user: require('./../routs/user/services')
}

module.exports = (io) => {
  io
    .of('/battle')
    .on('connection', function (socket) {
      socket.on('getUserField', (apiKey, roomId) => {
        services.game.getRoom(roomId)
          .then((roomData) => {
            const player = roomData.players.find(o => o.apiKey === apiKey) // search player info
            const index = roomData.players.indexOf(player)
            console.log(index)
            roomData.players[index].socketId = socket.id
            socket.join(roomId)
            roomData.markModified(`players`)
            roomData.save()
              .then(() => {
                console.log('ok')
              })
              .catch((err) => {
                console.log(err)
              })
            socket.emit('userField', player, roomData.players.length)
          })
          .catch((e) => {
          })
      })
      socket.on('shot', (data) => {
        services.game.getRoom(data.roomId)
          .then((room) => {
            if (services.game.checkTurn(room, socket.id, room.indexOfCurrentPlayer)) {
              if (data.option) {
                room.players[room.indexOfCurrentPlayer].superWeapon.splice(room.players[room.indexOfCurrentPlayer].superWeapon.indexOf(data.option), 1)
              }
              const player1 = room.indexOfCurrentPlayer
              let player2 = player1 + 1
              if (player1 === room.typeOfRoom - 1) {
                player2 = 0
              }
              if (!checkHit(data.idX, data.idY, room.players[player1], room.players[player2], data.option)) {
                if (room.indexOfCurrentPlayer + 1 === room.typeOfRoom) {
                  room.indexOfCurrentPlayer = 0
                } else {
                  room.indexOfCurrentPlayer++
                }
              }
              for (let i = 0; i < room.players[0].shipsStatus.length; i++) {
                room.players[0].shipsStatus[i] = true
                // room.players[1].shipsStatus[i] = true
              }
              if (isFinishGame(room)) {
                console.log('won')
                io.of('/battle').emit('test')
                io.of('/battle').to(data.roomId).emit('gameOver')
              }
              room.markModified(`players`)
              room.save()
                .then(() => {
                  socket.emit('shotResult', room.players[player1])
                  socket.broadcast.to(room.players[player2].socketId).emit('userField', room.players[player2])
                })
                .catch((err) => {
                  console.log(err)
                })
            } else {
              console.log('bad click')
            }
          })
          .catch((e) => {
            console.log(e)
          })
          // console.log('successful connection to ', socket.id)
        socket.on('disconnect', function () {
          console.log('Unconnection <--', socket.id)
        })
      })
    })
}
