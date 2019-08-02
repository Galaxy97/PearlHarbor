const express = require('express')
const bodyParser = require('body-parser')
const user = require('./routs/user/routs')
const app = express()
const RequestError = require('./errors/RequestError')
const session = require('express-session')
const game = require('./routs/game/routs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//app.use(bodyParser.text())

app.use(session({
  secret: 'dasfasdfasdfasdfsadfadsfadsfasdf',
  resave: false,
  cookie: { secure: true }
}))

app.set('views', './app/views')
app.set('view engine', 'hbs')

app.use('/', user)

app.use('/game', game)

app.use(function (err, req, res, next) {
  if (err instanceof RequestError) {
    res.status(err.code)
    res.send(err.message)
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
