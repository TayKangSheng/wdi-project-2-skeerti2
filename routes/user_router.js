var express = require('express')
router = express.Router()
var User = require('../models/user')
var passport = require('passport')


router.get('/', function (req, res) {
  res.render('auth/login')
})

router.post('/', function (req, res) {
  var loginStrategy = passport.authenticate('local-login-user', { // it will look for 'local-signup in passport strategy in passportConfig'
    successRedirect: '/homepage', // if succesful, go to '/' and so on
    failureRedirect: '/login',
    failureFlash: true // if some error in signup, say something is wrong
  })
  return loginStrategy(req, res)
})
module.exports = router
