const RequestError = require('../errors/RequestError')

const validate = (validator) => (req, res, next) => {
  if (!validator(req.body)) {
    return next(new RequestError(400, validator.errors))
  }
  next()
}

module.exports = validate
