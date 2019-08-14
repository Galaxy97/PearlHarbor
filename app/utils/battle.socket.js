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
            try {
              const player = roomData.players.find(o => o.apiKey === apiKey) // search player info
              const index = roomData.players.indexOf(player)
              console.log(index)
              roomData.players[index].socketId = socket.id
              roomData.markModified(`players`)
              roomData.save()
                .then(() => {
                  console.log('ok')
                })
                .catch((err) => {
                  console.log(err)
                })
              socket.emit('userField', player, roomData.indexOfCurrentPlayer)
            } catch (err) {
              console.log(err)
            }
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
              let player2 = room.indexOfCurrentPlayer + 1
              if (room.indexOfCurrentPlayer === room.typeOfRoom - 1) {
                player2 = 0
              }
              if (!checkHit(data.idX, data.idY, room.players[room.indexOfCurrentPlayer], room.players[player2], data.option)) {
                if (room.indexOfCurrentPlayer === room.typeOfRoom - 1) {
                  room.indexOfCurrentPlayer = 0
                } else {
                  room.indexOfCurrentPlayer++
                }
              }
              if (isFinishGame(room.players)) {
                console.log('won')
                io.to(data.roomId).emit('gameOver', room.winnerApiKey)
              }
              room.markModified(`players`)
              room.save()
                .then(() => {
                  console.log('ok')
                  socket.emit('shotResult', (room.player[room.indexOfCurrentPlayer].enemyField, room.indexOfCurrentPlayer))
                  socket.broadcast.to(room.players[player2].socketId).emit('allPlayersInfo', room.players[player2].matrix)
                })
                .catch((err) => {
                  console.log(err)
                })
              for (let i = 0; i < 10; i++) {
                let temp = ''
                for (let j = 0; j < 10; j++) {
                  temp += room.players[room.indexOfCurrentPlayer].enemyField[i][j]
                }
                console.log(temp)
              }
              console.log('\n\n\n')
              for (let i = 0; i < 10; i++) {
                let temp = ''
                for (let j = 0; j < 10; j++) {
                  temp += room.players[player2].matrix[i][j]
                }
                console.log(temp)
              }
            } else {
              console.log('bad click')
            }
          })
          .catch((e) => {
            console.log(e)
          })
        console.log('successful connection to ', socket.id)
        socket.on('disconnect', function () {
          console.log('Unconnection <--', socket.id)
        })
      })
    })
}
