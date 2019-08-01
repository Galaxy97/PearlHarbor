const express = require('express')
const bodyParser = require('body-parser')
const user = require('./routs/user/routs')
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', './app/views')
app.set('view engine', 'hbs')

app.use('/', user)

console.log(`
***********************************************
*********  Server is ready for usage  *********
***********************************************
***********************************************
`)

module.exports = app
