const express = require('express')
const services = require('./services')
const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const RequestError = require('../../errors/RequestError')
const validation = require('./validators/Validator')
const registration = require('./validators/registrationSchema')
const login = require('./validators/loginSchema')
const user = require('./models/usermodel')
const config = require('../../config/index')
const db = require('../../db/database')


const router = express.Router()

router.get('/', (req, res) => {
  res.render('user/index')
})

router.post('/signup', (req, res, next) => {
  const message = validation(req.body, registration)
  if(message) {
    return next( new RequestError(400, message))
  }
  if(req.body.password !== req.body.confirmPassword) {
    return next( new RequestError(400, 'Passwords should match'))
  }
  new user ({
    id: uuidv4(),
    name: req.body.name,
    password: crypto.createHash('md5', config.secret).update(req.body.password).digest('hex'),
    sessions: 0,
    wins: 0,
    apiKey: uuidv4(),
    registeredAt: new Date()
  }).save()
  .then(() => {
    res.status(200).send('Successfully registered')
  })
router.post('/login', (req, res, next) => {
  const message = validation(req.body, login)
  if(message) {
    return next(new RequestError(400, message))
  }
  
})
})

module.exports = router
