const express = require('express')
const validatorBody = require('../../web-validator/validate-middleware-body')
const userValidatorSchema = require('./validator')
const services = require('./services')
// const session = require('express-session')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('user/index')
})

router.get('/signup', (req, res, next) => {
  res.render('user/registration')
})

router.get('/login', (req, res, next) => {
  res.render('user/login')
})

router.get('/game', services.authenticate, (req, res, next) => {
  res.render('user/index')
})
router.get('/chat', services.authenticate, (req, res, next) => {
  res.render('chat/chat')
})

router.post('/signup', validatorBody(userValidatorSchema.signup), (req, res, next) => {
  services.signupFunc(req, res, next)
})

router.post('/login', validatorBody(userValidatorSchema.login), (req, res, next) => {
  services.loginFunc(req, res, next)
})

module.exports = router
