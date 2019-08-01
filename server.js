const http = require('http')
const app = require('./app/app')

const PORT = 3000

app.set('port', PORT)
http.createServer(app).listen(PORT)
