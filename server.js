const app = require('./app/app')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const config = require('./app/config/index')
require('./app/utils/main.socket')(io)

app.set('port', config.port)
server.listen(config.port, config.host, () => {
  console.log(`Server running at ${config.host}`)
})
