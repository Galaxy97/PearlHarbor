const express = require('express')
const router = express.Router()
const services = require('./services')
const generateField = require('../../utils/randomgamefield').randomize

router.get('/', services.authenticate, (req, res, next) => { // locallost/game
  res.render('game/game')
})

// router.get('/game', (req, res) => {
//   res.render('game/game')
// })

router.get('/field', (req, res, next) => {
  res.status(200).send(generateField())
})

module.exports = router
