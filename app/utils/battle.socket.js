const checkHit = require('./checkHit').checkHit
const isFinishGame = require('./checkHit').isFinishGame
const isOut = require('./checkHit').isOut
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
            roomData.players[index].socketId = socket.id
            socket.join(roomId)
            roomData.markModified(`players`)
            roomData.save()
            socket.emit('userField', player)
            socket.emit('renderEnemyFields', roomData.players, player.apiKey)
            let turn
            roomData.indexOfCurrentPlayer === index ? turn = true : turn = false
            socket.emit('whoTurn', turn)
          })
          .catch((e) => {
            console.error(e)
          })
      })
      socket.on('shot', (data) => {
        services.game.getRoom(data.roomId)
          .then((room) => {
            if (services.game.checkTurn(room, socket.id, room.indexOfCurrentPlayer) && !room.retiredPlayers.includes(room.indexOfCurrentPlayer)) {
              const player1 = room.indexOfCurrentPlayer
              const player2 = room.players.indexOf(room.players.find(o => o.apiKey === data.enemyApiKey))
              if (room.retiredPlayers.includes(player2)) {
                return
              }
              if (data.option) {
                room.players[player1].superWeapon.splice(room.players[player1].superWeapon.indexOf(data.option), 1)
              }
              if (!checkHit(data.idX, data.idY, room.players[player1], room.players[player2], data.option)) {
                do {
                  if (room.indexOfCurrentPlayer + 1 === room.typeOfRoom) {
                    room.indexOfCurrentPlayer = 0
                  } else {
                    room.indexOfCurrentPlayer++
                  }
                } while (room.retiredPlayers.includes(room.indexOfCurrentPlayer))
              }
              if (isOut(room.players[player2])) {
                room.retiredPlayers.push(player2)
                if (isFinishGame(room)) {
                  for (let i = 0; i < room.players.length; i++) {
                    if (room.winnerApiKey === room.players[i].apiKey) {
                      services.user.updateBase(room.players[i], 1)
                    } else {
                      services.user.updateBase(room.players[i], 0)
                    }
                  }
                  io.of('/battle').to(data.roomId).emit('gameOver', room.winnerApiKey)
                }
              }
              room.markModified(`players`)
              room.save()
                .then(() => {
                  const playersApiKey = []
                  room.players.forEach(element => {
                    playersApiKey.push(element.apiKey)
                  })
                  for (let i = 0; i < room.players.length; i++) {
                    if (room.players[i].apiKey === room.players[player2].apiKey) {
                      socket.broadcast.to(room.players[player2].socketId).emit('userField', room.players[player2], playersApiKey)
                      let turn
                      room.indexOfCurrentPlayer === i ? turn = true : turn = false
                      socket.broadcast.to(room.players[player2].socketId).emit('whoTurn', turn)
                    } else {
                      if (socket.id === room.players[i].socketId) {
                        socket.emit('shotResult', room.players, room.players[i].apiKey)
                        let turn
                        room.indexOfCurrentPlayer === i ? turn = true : turn = false
                        socket.emit('whoTurn', turn)
                      } else {
                        socket.broadcast.to(room.players[i].socketId).emit('shotResult', room.players, room.players[i].apiKey)
                        let turn
                        room.indexOfCurrentPlayer === i ? turn = true : turn = false
                        socket.broadcast.to(room.players[i].socketId).emit('whoTurn', turn)
                      }
                    }
                  }
                })
            } else {
              console.log('err')
            }
          })
          .catch((e) => {
            console.error(e)
          })
        socket.on('disconnect', function () {
        })
      })
    })
}
