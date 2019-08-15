const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/battle', (req, res) => { // locallost/game/three-payers
  res.render('game/battle')
})

router.get('/', (req, res) => { // locallost/game
  res.redirect('/')
})

module.exports = router
