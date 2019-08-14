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
            socket.emit('userField', player, roomData.indexOfCurrentPlayer)
          })
          .catch((e) => {
          })
      })

      socket.on('shot', (shotInfo) => {
        socket.emit('shotResult', (plater.enemyField, indexOfCurrentPlayer))
        socket.broadcast.to(element.socketId).emit('allPlayersInfo', data)
      })

      console.log('successful connection to ', socket.id)
      socket.on('disconnect', function () {
        console.log('Unconnection <--', socket.id)
      })
    })
}
