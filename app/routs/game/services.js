const User = require('../user/models/usermodel')
const RequestError = require('../../errors//RequestError')

function authenticate (req, res, next) {
  const params = req.headers['x-api-key']
  User.findOne({ apiKey: params },
    function (err, founduser) {
      if (err) {
        return next(new RequestError(400, err))
      }
      if (founduser === null) {
        return next(new RequestError(401, 'User is not logged'))
      }
      req.user = founduser
      next()
    })
}

module.exports = { authenticate }
