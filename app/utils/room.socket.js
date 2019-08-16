const uuidv4 = require('uuid/v4')
// const checkHit = require('./checkHit').checkHit
// const isFinishGame = require('./checkHit').isFinishGame

const services = {
  game: require('./../routs/game/services'),
  user: require('./../routs/user/services')
}

module.exports = (io) => {
  io
    .of('/room')
    .on('connection', function (socket) {
      socket.on('authentication', (authData) => { // authData: apiKey, typeRoom
        services.game.getPlayerInfo(authData.apiKey)
          .then((userInfo) => {
            services.game.findFreeRoom(authData.typeRoom)
              .then((roomData) => {
                if (!roomData) {
                  // room not found Create new room
                  const roomId = uuidv4()
                  const player = services.game.createNewPlayer(socket.id, authData.apiKey, userInfo.perks) // create field player
                  const room = { // info about user
                    id: roomId,
                    turn: 0,
                    position: 0,
                    playerInfo: {
                      name: userInfo.name,
                      sessions: userInfo.sessions,
                      wins: userInfo.wins,
                      lastPlayDate: userInfo.updatedAt
                    }
                  }
                  services.game.createNewRoom(roomId, player, authData.typeRoom) // create new room in database
                  socket.join(roomId)
                  socket.emit('message', room)
                } else {
                  // else room is exist and free
                  const player = services.game.createNewPlayer(socket.id, authData.apiKey, userInfo.perks) // create field player
                  const room = { // info about user
                    id: roomData.roomId,
                    turn: 0,
                    playerInfo: {
                      name: userInfo.name,
                      sessions: userInfo.sessions,
                      wins: userInfo.wins,
                      lastPlayDate: userInfo.updatedAt
                    }
                  }
                  let close = false
                  if (roomData.players.length === roomData.typeOfRoom - 1) {
                    close = true
                  }
                  socket.join(roomData.roomId)
                  services.game.updateRoom(roomData.roomId, player, close) // if close true room is closed
                  socket.emit('message', room)
                  const allPlayersInfo = []
                  roomData.players.forEach(element => {
                    allPlayersInfo.push(services.game.getPlayerInfo(element.apiKey))
                  })
                  Promise.all(allPlayersInfo)
                    .then((data) => {
                      data.push(room.playerInfo)
                      roomData.players.forEach(element => {
                        socket.broadcast.to(element.socketId).emit('allPlayersInfo', data)
                      })
                      socket.emit('allPlayersInfo', data)
                    })
                    .catch((e) => {
                      throw e
                    })
                  if (close) {
                    io.of('/room').to(roomData.roomId).emit('letsBattle')
                  }
                }
              })
              .catch((e) => {
                throw e
              })
          })
          .catch((e) => {
            throw e
          })
      })
      socket.on('disconnect', function () {
      })
    })
}
