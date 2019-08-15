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
            const playersApiKey = []
            roomData.players.forEach(element => {
              playersApiKey.push(element.apiKey)
            })
            socket.emit('userField', player, playersApiKey)
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
              const player2 = room.players.indexOf(room.players.find(o => o.apiKey === data.enemyApiKey))
              if (!checkHit(data.idX, data.idY, room.players[player1], room.players[player2], data.option)) {
                if (room.indexOfCurrentPlayer + 1 === room.typeOfRoom) {
                  room.indexOfCurrentPlayer = 0
                } else {
                  room.indexOfCurrentPlayer++
                }
              }
              if (isFinishGame(room)) {
                console.log('won')
                for (let i = 0; i < room.players.length; i++) {
                  if (room.winnerApiKey === room.players[i].apiKey) {
                    services.user.updateBase(room.players[i], 1)
                  } else {
                    services.user.updateBase(room.players[i], 0)
                  }
                }
                io.of('/battle').to(data.roomId).emit('gameOver', room.winnerApiKey)
              }
              room.markModified(`players`)
              room.save()
                .then(() => {
                  const playersApiKey = []
                  room.players.forEach(element => {
                    playersApiKey.push(element.apiKey)
                  })
                  socket.emit('shotResult', room.players[player1], room.players[player2].apiKey)
                  socket.broadcast.to(room.players[player2].socketId).emit('userField', room.players[player2], playersApiKey)
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
        socket.on('disconnect', function () {
          console.log('Unconnection <--', socket.id)
        })
      })
    })
}
