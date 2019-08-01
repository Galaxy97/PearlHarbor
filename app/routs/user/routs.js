const express = require('express')
const services = require('./services')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('user/index')
})

module.exports = router