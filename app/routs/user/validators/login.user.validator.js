const ajv = require('ajv')()

const schema = ajv.compile({
  type: 'object',
  required: ['name', 'password'],
  properties: {
    name: { type: 'string' },
    password: { type: 'string' }
  }
})

module.exports = schema
