const http = require('http')
const app = require('./app/app')
const config = require('./app/config/index')

app.set('port', config.port)
http.createServer(app).listen(config.port)
