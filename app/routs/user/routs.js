const express = require('express')
const validatorBody = require('../../web-validator/validate-middleware-body')
const userValidatorSchema = require('./validator')
const services = require('./services')
const gamefield = require('../../utils/randomgamefield').randomize
// const session = require('express-session')

const router = express.Router()

// router.get('/', (req, res) => {
//   res.render('user/index', { path: '/game' })
// })

router.get('/signup', (req, res, next) => {
  res.render('user/signup')
})

router.get('/login', (req, res, next) => {
  res.render('user/login')
})

router.get('/', services.authenticate, (req, res, next) => {
  res.render('user/index', { path: '/game/lobby' })
})

router.post('/signup', validatorBody(userValidatorSchema.signup), (req, res, next) => {
  services.signupFunc(req, res, next)
})

router.post('/login', validatorBody(userValidatorSchema.login), (req, res, next) => {
  services.loginFunc(req, res, next)
})

router.get('/logout', validatorBody(userValidatorSchema.login))

module.exports = router
