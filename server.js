const app = require('./app/app')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
require('./app/utils/socket')(io)

const PORT = 3000

app.set('port', PORT)
server.listen(PORT)
