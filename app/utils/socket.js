module.exports = (io) => {
  io.sockets.on('connection', function (socket) {
    console.log('successful connection')
    socket.emit('test', socket.handshake)
    socket.on('disconnect', function (data) {
      console.log('Unconnection <--')
    })
  })
}
