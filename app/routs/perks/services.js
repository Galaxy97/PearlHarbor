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

const getRandomPerk = (req, res, next) => {
  let result
  const value = getRandomInt(48)
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
      if (founduser.perks.length < 3) {
        founduser.perks.push(result)
        founduser.save()
        console.log(result)
        req.perk = result
        next()
      } else {
        result = 'no'
        console.log('no')
        req.perk = result
        next()
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports = { authenticate, getRandomPerk }
