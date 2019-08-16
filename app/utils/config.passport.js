const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../routs/user/models/usermodel')
const config = require('../config/index')
const crypto = require('crypto')

const userDB = {
  id: 136345,
  email: 'test@mail.ru',
  password: '123'
}

passport.serializeUser(function (user, done) {
  console.log('serialize ', user)
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  console.log('deserialize: ', id)
  User.findOne(
    {
      id: id
    })
    .then((user) => {
      return done(null, user)
    })
    .catch((e) => {
      console.log(e)
      return done(null, false)
    })
})

passport.use(
  new LocalStrategy({ usernameField: 'name' }, function (
    name,
    password,
    done
  ) {
    User.findOne(
      {
        name: name,
        password: crypto.createHash('md5', config.hashsecret).update(password).digest('hex')
      })
      .then((user) => {
        return done(null, user)
      })
      .catch((e) => {
        console.log(e)
        return done(null, false)
      })
  })
)
