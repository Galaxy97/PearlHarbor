const express = require('express')
const router = express.Router()

router.get('/lobby', (req, res) => {
  res.render('game/lobby')
})

router.get('/battle', (req, res) => {
  res.render('game/battle')
})

module.exports = router
