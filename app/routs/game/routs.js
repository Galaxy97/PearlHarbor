const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/', services.authenticate, (req, res, next) => { // locallost/game
  res.render('game/game')
})

module.exports = router
