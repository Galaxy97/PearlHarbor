const express = require('express')
<<<<<<< HEAD
// const services = require('./services')
=======
const validatorBody = require('../../web-validator/validate-middleware-body')
const userValidatorSchema = require('./validator')
const services = require('./services')
// const db = require('../../db/database')
// const session = require('express-session')

>>>>>>> d70835089dfd923eb675e91396b5070b01b2290e
const router = express.Router()

router.get('/', (req, res) => {
  res.render('user/index')
})

<<<<<<< HEAD
=======
router.get('/signup', (req, res) => {
  res.render('user/registration')
})

router.get('/login', (req, res) => {
  res.render('user/login')
})

router.post('/signup', (req, res, next) => {
  services.signupFunc(req, res, next)
})

router.post('/login', validatorBody(userValidatorSchema.login), (req, res, next) => {
  services.loginFunc(req, res, next)
})

>>>>>>> d70835089dfd923eb675e91396b5070b01b2290e
module.exports = router
