const services = {
  game: require('./../routs/game/services'),
  user: require('./../routs/user/services')
}

module.exports = (io) => {
  io
    .of('/battle')
    .on('connection', function (socket) {

      socket.on('userField', (apiKey, roomId) => {
        services.game.getRoom(roomId)
          .then((roomData) => {
            const player = (apiKey) => room.Players.find(player => {
              return player.apiKey === apiKey
            })
          })
          .catch((e) => {

          })
      })

      console.log('successful connection to ', socket.id)
      socket.on('disconnect', function () {
        console.log('Unconnection <--', socket.id)
      })
    })
}
