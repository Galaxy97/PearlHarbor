const RequestError = require('../../errors/RequestError')
const User = require('./models/usermodel')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const config = require('../../config/index')
const cookie = require('cookie')
const passport = require('passport')

const login = (req, res, next) => {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(new RequestError(400, err))
    }
    if (!user) {
      return next(new RequestError(400, 'Wrong name or password'))
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(new RequestError(400, err))
      }
      res.status(200).send(user.apiKey)
    })
  })(req, res, next)
}

const signup = (req, res, next) => {
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
}

const authenticate = (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new RequestError(401, 'User is not logged'))
  }
  const apikey = cookie.parse(req.headers.cookie).apiKey
  User.findOne({ apiKey: apikey },
    function (err, founduser) {
      if (err) {
        return next(new RequestError(400, err))
      }
      if (founduser === null) {
        return next(new RequestError(401, 'User is not logged'))
      }
      next()
    })
}

const update = (user, GameResult) => {
  User.update({ apiKey: user.apiKey },
    { $inc: { wins: GameResult, sessions: 1 } })
    .catch((e) => {
      throw e
    })
}

module.exports = {
  loginFunc: login,
  signupFunc: signup,
  authenticate: authenticate,
  updateBase: update
}
