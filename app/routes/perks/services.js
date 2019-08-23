const User = require('../user/models/usermodel')
const RequestError = require('../../errors//RequestError')
const cookie = require('cookie')

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
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const getRandomPerk = (req, res) => {
  let result
  const value = getRandomInt(47)
  if (value === 0) {
    result = 'boundsStrike100'
  } else if (value < 4) {
    result = 'rightDiagonal'
  } else if (value < 7) {
    result = 'leftDiagonal'
  } else if (value < 17) {
    result = 'columnStrike'
  } else if (value < 27) {
    result = 'rowStrike'
  } else if (value < 47) {
    result = '4xShot'
  }
  User.findOne({ apiKey: cookie.parse(req.headers.cookie).apiKey })
    .then((founduser) => {
      founduser.perks.push(result)
      founduser.save()
      res.render('perks/successfullPay', {
        perk: result
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const getUserPerks = (req, res) => {
  User.findOne({ apiKey: cookie.parse(req.headers.cookie).apiKey })
    .then((user) => {
      res.json(user.perks)
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = { authenticate, getRandomPerk, getUserPerks }
