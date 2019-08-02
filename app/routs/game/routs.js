const express = require('express')
const router = express.Router()
const authenticate = require('./services').authenticate

router.get('/', authenticate, (req, res) => {
  res.status(200).send()
})

router.get('/field', (req, res) => {
  res.render('game/lobby')
})

module.exports = router
