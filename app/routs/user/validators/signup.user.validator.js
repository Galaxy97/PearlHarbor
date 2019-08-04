const ajv = require('ajv')()

const schema = ajv.compile({
  type: 'object',
  additionalProperties: false,
  required: ['name', 'password', 'confirmPassword'],
  properties: {
    name: { type: 'string' },
    password: { type: 'string' },
    confirmPassword: { type: 'string' }
  }
})

module.exports = schema
