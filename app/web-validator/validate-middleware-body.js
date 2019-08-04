const RequestError = require('../errors/RequestError')

const validate = (validator) => (req, res, next) => {
  console.log('body', req.body)
  console.log('in validator')
  if (!validator(req.body)) {
    console.log('valid', validator.errors)
    return next(new RequestError(400, validator.errors))
  }
  next()
}

module.exports = validate
