const RequestError = require('../errors/RequestError')

const validate = (validator) => (req, res, next) => {
  if (!validator(req.body)) {
    console.log('really not ok', validator.errors)
    return next(new RequestError(400, validator.errors))
  }
  next()
}

module.exports = validate
