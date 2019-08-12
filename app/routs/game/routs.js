const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/twoPlayers', services.authenticate, (req, res, next) => { // locallost/game/two-payers
  res.render('game/twoPlayers')
})

router.get('/threePlayers', services.authenticate, (req, res, next) => { // locallost/game/three-payers
  res.render('game/threePlayers')
})

router.get('/', (req, res) => { // locallost/game
  res.redirect('/')
})

module.exports = router
