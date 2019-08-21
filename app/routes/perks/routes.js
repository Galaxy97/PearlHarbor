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
  stripe.customers.create({
    email: req.body.stripeEmail, // customer email
    source: req.body.stripeToken // token for the card
  })
    .then(customer =>
      stripe.charges.create({ // charge the customer
        amount: '99',
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
      }))
    .then(charge => {
      services.getRandomPerk(req, res)
    })
    .catch((e) => {
      console.log(e)
    })
})

module.exports = router
