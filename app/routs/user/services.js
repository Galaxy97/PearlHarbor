const RequestError = require('../../errors/RequestError')
const User = require('./models/usermodel')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const config = require('../../config/index')

const login = (req, res, next) => {
  console.log('do req')
  User.findOne(
    {
      name: req.body.name,
      password: crypto.createHash('md5', config.hashsecret).update(req.body.password).digest('hex')
    })
    .then((user) => {
      console.log('uuuuu')
      if (user === null) {
        return next(new RequestError(400, 'Wrong name or password'))
      }
      res.status(200).send(user.apiKey)
    })
    .catch((err) => {
      console.log('err')
      return next(new RequestError(400, err))
    })
}

const signup = (req, res, next) => {
  console.log('in func', req.body)
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
      console.log('create new user')
      res.status(200).send('Successfully registered')
    })
    .catch((err) => {
      console.log('errrror')
      return next(new RequestError(400, err))
    })
}

module.exports = {
  loginFunc: login,
  signupFunc: signup
}
