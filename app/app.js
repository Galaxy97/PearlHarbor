const express = require('express')
require('./db/database')
const bodyParser = require('body-parser')
const user = require('./routs/user/routs')
const chat = require('./routs/chat/routs')
const app = express()
const RequestError = require('./errors/RequestError')
const session = require('express-session')
const game = require('./routs/game/routs')
require('./db/database')

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.text())

app.use(session({
  secret: 'dasfasdfasdfasdfsadfadsfadsfasdf',
  resave: false,
  cookie: { secure: true }
}))

app.set('views', './app/views')
app.set('view engine', 'hbs')

app.use('/', user)
app.use('/chat', chat)

app.use('/game', game)

app.use(function (err, req, res, next) {
  if (err.code !== 500) {
    if (err.code === 401) {
      res.status(err.code).send('Not logged')
    } else {
    res.status(err.code).send(err.message)
    }
  } else {
    console.log(err)
    res.status(500)
    res.send('<h1>Server Error</h1>')
  }
})

console.log(`
***********************************************
*********  Server is ready for usage  *********
***********************************************
***********************************************
`)

module.exports = app
