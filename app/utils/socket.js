const uuidv4 = require('uuid/v4')
const checkHit = require('./checkHit').checkHit
const isFinishGame = require('./checkHit').isFinishGame
const createNewRoom = require('../routs/game/services').createNewRoom

const services = {
  game: require('./../routs/game/services'),
  user: require('./../routs/user/services')
}

module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('authentication', (data) => {
      services.game.getPlayerInfo(data.apiKey)
        .then((user) => {
          const roomType = Number(socket.handshake.query.roomType)
          services.game.findFreeRoom(roomType)
            .then((roomData) => {
              if (roomData) {
                if (data.apiKey === roomData.player1apiKey) {
                  services.game.getPlayerInfo(roomData.player1apiKey) // call to database
                    .then((info) => {
                      console.log('infoooo', info)
                      socket.emit('message', {
                        yourTurn: roomData.isFirstPlayerTurn,
                        roomId: roomData.roomId,
                        player1Info: info,
                        player: roomData.player1
                      }) // send playerInfo
                      // io.sockets.connected[roomData.player1socketId].leave(roomData.roomId)
                      socket.join(roomData.roomId)
                      services.game.updateSocketId(roomData.roomId, socket.id, true) // player1 = true ; player2 = false
                    })
                    .catch((e) => {
                      console.log(e)
                    })
                } else {
                  // if free room is exsist this player 2 and start game
                  socket.join(roomData.roomId)
                  const player = services.game.createNewPlayer(user.perks)
                  const room = {
                    roomId: roomData.roomId,
                    yourTurn: false,
                    player: player, // fiels for game player 2
                    player2Info: {
                      apiKey: data.apiKey,
                      name: user.name,
                      sessions: user.sessions,
                      wins: user.wins,
                      lastPlayDate: user.updatedAt
                    }
                  }
                  services.game.getPlayerInfo(roomData.player1apiKey) // call to database
                    .then((info) => {
                      // console.log('infoooo', info)
                      room.player1Info = info
                      socket.emit('messeage', room) // send playerInfo
                      // socket.emit('enemyInfo', info) // send playerInfo
                      socket.join(roomData.roomId)
                      battle(io, roomData.roomId, socket, player, room.player2Info, data.apiKey)
                    })
                    .catch((e) => {
                      console.log(e)
                    })
                }
              } else { // this player 1
                // create new room
                const roomId = uuidv4()
                const player = services.game.createNewPlayer(user.perks, socket.id, data.apiKey)
                createNewRoom(roomId, player, roomType)
                socket.join(roomId)
                const room = {
                  roomId: roomId,
                  yourTurn: true,
                  player: player
                }
                socket.emit('message', room)
              }
            })
            .catch((e) => {
              console.log('error', e)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    })

    // socket.on('recovery', (data) => {
    //   services.game.getGameRoom(data.roomId)
    //     .then((room) => {
    //       if (data.playerId === room.player1socketId) {
    //         socket.emit('userRecovery', {
    //           playerField: room.player1.matrix,
    //           enemyField: room.player1.enemyField,
    //           superWeapon: room.player1.superWeapon,
    //           turn: room.isFirstPlayerTurn
    //         })
    //         services.game.updateSocketId(data.roomId, socket.id, true) // player1 = true ; player2 = false
    //       } else if (data.playerId === room.player2socketId) {
    //         socket.emit('userRecovery', {
    //           playerField: room.player2.matrix,
    //           enemyField: room.player2.enemyField,
    //           superWeapon: room.player2.superWeapon,
    //           turn: !room.isFirstPlayerTurn
    //         })
    //         services.game.updateSocketId(data.roomId, socket.id, false) // player1 = true ; player2 = false
    //       }
    //     })
    //     .catch((e) => {
    //       console.log(e)
    //     })
    //   socket.emit('playerId', socket.id)
    // })

    // socket.on('shot', (data) => {
    // })

    console.log('successful connection to socket', socket.id)
    socket.on('disconnect', function () {
      console.log('Unconnection <--', socket.id)
    })
  })
}

function battle (io, roomId, socket, player, player2Info, apiKey) {
  services.game.updateRoom(roomId, player, socket.id, apiKey, true) // close this room for new connections
  const arr = Object.keys(socket.adapter.rooms[roomId].sockets)
  socket.broadcast.to(arr[0]).emit('enemyInfo', player2Info)
  socket.broadcast.to(arr[0]).emit('playerId', arr[0]) // arr[0] = socket.id player 1
  socket.emit('playerId', arr[1]) // arr[1] = socket.id player 2

  io.to(roomId).emit('letsBattle')
}
