const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/', services.authenticate, (req, res, next) => { // locallost/perks
  res.render('perks/perks')
})

router.get('/getperk', services.authenticate, services.getRandomPerk, (req, res, next) => {
  res.status(200).send(req.perk)
})

module.exports = router
