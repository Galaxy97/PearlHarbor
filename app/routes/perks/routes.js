const express = require('express')
const router = express.Router()
const services = require('./services')
const stripe = require('stripe')('sk_test_F6Hn4p9f5iHWgMQztzS5sMhc00awlflqYX')

router.get('/', services.authenticate, (req, res, next) => { // locallost/perks
  res.render('perks/perks')
})

router.get('/getuserperks', services.authenticate, (req, res) => { // locallost/perks
  services.getUserPerks(req, res)
})

router.get('/getperk', services.authenticate, (req, res) => {
  services.getRandomPerk(req, res)
})

router.post('/pay', (req, res) => {
  console.log(req.body.email, req.body.payMethod)
  stripe.charges.create({
    amount: 99,
    currency: 'usd',
    source: req.body.payMethod, // obtained with Stripe.js
    description: 'some description'
  }, function (e, charge) {
    if (e) {
      console.log(e)
      res.status(400).send({ message: e })
    }
    res.send({ message: 'successful' })
  })
})

module.exports = router
