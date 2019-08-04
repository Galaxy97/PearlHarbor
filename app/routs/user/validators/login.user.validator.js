const ajv = require('ajv')()

const schema = ajv.compile({
  type: 'object',
  additionalProperties: false,
  required: ['name', 'password'],
  properties: {
    name: { type: 'string' },
    password: { type: 'string' }
  }
})

module.exports = schema
