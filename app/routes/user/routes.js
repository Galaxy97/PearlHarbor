const express = require('express')
const validatorBody = require('../../web-validator/validate-middleware-body')
const userValidatorSchema = require('./validator')
const services = require('./services')
const cookie = require('cookie')

const router = express.Router()

router.get('/signup', (req, res, next) => {
  res.render('user/signup')
})

router.get('/login', (req, res, next) => {
  res.render('user/login')
})

router.get('/', services.authenticate, (req, res, next) => {
  res.render('user/index')
})

router.get('/room', services.authenticate, (req, res, next) => {
  res.render('game/waitingRoom')
})

router.post('/signup', validatorBody(userValidatorSchema.signup), (req, res, next) => {
  services.signupFunc(req, res, next)
})

router.post('/login', validatorBody(userValidatorSchema.login), (req, res, next) => {
  services.loginFunc(req, res, next)
})

router.get('/getshorthistory', services.authenticate, (req, res, next) => {
  services.getHistrory(0, cookie.parse(req.headers.cookie).apiKey, res)
})

router.get('gethistory', services.authenticate, (req, res, next) => {

})

router.get('/logout', validatorBody(userValidatorSchema.login))

module.exports = router
