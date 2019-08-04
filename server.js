const app = require('./app/app')
<<<<<<< HEAD
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
require('./app/utils/socket')(io)

const PORT = 3000

app.set('port', PORT)
server.listen(PORT)
=======
const config = require('./app/config/index')

app.set('port', config.port)
http.createServer(app).listen(config.port)
>>>>>>> d70835089dfd923eb675e91396b5070b01b2290e
