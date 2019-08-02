const express = require('express')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const RequestError = require('../../errors/RequestError')
const validation = require('./validators/Validator')
const registration = require('./validators/registrationSchema')
const login = require('./validators/loginSchema')
const User = require('./models/usermodel')
const config = require('../../config/index')
const db = require('../../db/database')
const session = require('express-session')

const router = express.Router()

router.get('/signup', (req, res) => {
  res.render('user/registration')
})

router.get('/login', (req, res) => {
  res.render('user/login')
})

router.post('/signup', (req, res, next) => {
  const message = validation(req.body, registration)
  if (message) {
    console.log(message)
    return next(new RequestError(400, message))
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new RequestError(400, 'Passwords should match'))
  }
  new User({
    id: uuidv4(),
    name: req.body.name,
    password: crypto.createHash('md5', config.hashsecret).update(req.body.password).digest('hex'),
    sessions: 0,
    wins: 0,
    apiKey: uuidv4(),
    registeredAt: new Date()
  }).save()
    .then(() => {
      res.status(200).send('Successfully registered')
    })
    .catch((err) => {
      return next(new RequestError(400, err))
    })
})

router.post('/login', (req, res, next) => {
  const message = validation(req.body, login)
  if (message) {
    return next(new RequestError(400, message))
  }
  User.findOne(
    { name: req.body.name,
      password: crypto.createHash('md5', config.hashsecret).update(req.body.password).digest('hex')
    })
    .then((user) => {
      if (user === null) {
        return next(new RequestError(400, 'Wrong name or password'))
      }
      res.status(200).send(user.apiKey)
    })
    .catch((err) => {
      console.log('err')
      return next(new RequestError(400, err))
    })
})

module.exports = router
