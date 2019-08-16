require('./db/database')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const perks = require('./routs/perks/routs')
const user = require('./routs/user/routs')
const game = require('./routs/game/routs')

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', './app/views')
app.set('view engine', 'hbs')
app.use(express.static('./app/public'))

app.use(
  session({
    secret: 'hghtyNN23h',
    store: new FileStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
  })
)

require('./utils/config.passport')
app.use(passport.initialize())
app.use(passport.session())

app.use('/', user)
app.use('/game', game)
app.use('/perks', perks)

app.use(function (err, req, res, next) {
  if (err.code !== 500) {
    if (err.code === 401) {
      res.redirect('/login')
    } else {
      res.status(err.code).send(err.message)
    }
  } else {
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
