var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')

module.exports = function (passport) {
  passport.serializeUser(function (user, next) {
    next(null, user.id)
  })

  passport.deserializeUser(function (id, next) {
    User.findById(id, function (err, user) {
      next(err, user)
    })
  })

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, givenpassword, next) {
  // not checking for current users, but checking for local email
    User.findOne({'local.email': email}, function (err, foundUser) {
      if (err) return next(err)
      if (!foundUser) {
        console.log('no user found by this email')
        return next(err, false)
        //   req.flash('flash', {
        //   type: 'warning',
        //   message: 'No user found by this email'
        // })
      }

      if (!foundUser.validPassword(givenpassword)) {
        console.log('Access denied, wrong password')
        return next(null, false)
        //   req.flash('flash', {
        //   type: 'danger',
        //   message: 'Access Denied, wrong password'
        // })
      }

      return next(err, foundUser)
    })
  }))

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, next) { // done here is the next also
    // Find user with email as given from the callback
    User.findOne({'local.email': email}, function (err, foundUser) {
      console.log('foundUser is: '+ foundUser)

      if (foundUser) {
        // function(err,theNewUser, flashData)
        console.log('the same user with same email found')
        return next(null, false)
        //   req.flash('flash', {
        //   type: 'warning',
        //   message: 'This email is already in use'
        // })
      } else {
      // if not found = new User
    // save user to db, password is hashed
    // call next() middleware without error arguments
        let newUser = new User({
          local: {
            firstName: req.body.firstName,
            LastName: req.body.LastName,
            Address: req.body.Address,
            postalCode: req.body.postalCode,
            email: email,
        // password: password
            password: User.encrypt(password)
          }
        })
        console.log(newUser)
        newUser.save(function (err, output) {
        if(err) console.log("Error on new user:" + err)
        console.log('Hi new user')
        return next(null, newUser)
        // req.flash('flash', {
        //   type: 'success',
        //   message: 'Hello new user ' + newUser.local.email
        // })
        })
      }
    })
  }))
}
