const express = require('express')
const bodyParser = require('body-parser')
const user = require('./routs/user/routs')
const chat = require('./routs/chat/routs')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', './app/views')
app.set('view engine', 'hbs')

app.use('/', user)
app.use('/chat', chat)

console.log(`
***********************************************
*********  Server is ready for usage  *********
***********************************************
***********************************************
`)

module.exports = app
