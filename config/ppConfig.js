var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')
var Chef = require('../models/chef')

module.exports = function (passport) {
  passport.serializeUser(function (user, next) {
    next(null, user.id)
  })

  passport.deserializeUser(function (id, next) {
    User.findById(id, function (err, user) {
      if (user) {
        next(err, user)
      } else {
        Chef.findById(id, function (err2, chef) {
          next(err2, chef)
        })
      }
    })
  })

  passport.use('local-login-user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, givenpassword, next) {
  // not checking for current users, but checking for local email
    User.findOne({'local.email': email}, function (err, foundUser) {
      if (err) return next(err)
      if (!foundUser) {
        console.log('no user found by this email')
        return next(err, false,
          // req.flash('flash', {
          //   type: 'warning',
          //   message: 'Wrong email. Please enter a valid email'
          // })
          req.flash('warning', 'Wrong email. Please enter a valid email')
        )
      }

      if (!foundUser.validPassword(givenpassword)) {
        console.log('Access denied, wrong password')
        return next(null, false, req.flash('danger', 'Access Denied, please enter the correct password'))
          // req.flash('flash', {
          //   type: 'danger',
          //   message: 'Access Denied, please enter the correct password'
          // }))
      }

      return next(err, foundUser)
    })
  }))

  passport.use('local-signup-user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, next) { // done here is the next also
    // Find user with email as given from the callback
    User.findOne({'local.email': email}, function (err, foundUser) {
      console.log('foundUser is: ' + foundUser)

      if (foundUser) {
        // function(err,theNewUser, flashData)
        console.log('the same user with same email found')
        return next(null, false, req.flash('warning', 'This email is already in use'))
        //   req.flash('flash', {
        //   type: 'warning',
        //   message: 'This email is already in use'
        // }))
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
          if (err) {
            console.log('Error on new Chef:' + err)
            return next(err)
          }

          console.log('Hi new user')
          return next(null, newUser, req.flash('success', 'Hello new user ' + newUser.local.email))
        // req.flash('flash', {
        //   type: 'success',
        //   message: 'Hello new user ' + newUser.local.email
        // }))
        })
      }
    })
  }))

// for chef login
  passport.use('local-login-chef', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, givenpassword, next) {
// not checking for current users, but checking for local email
    Chef.findOne({'local.email': email}, function (err, foundChef) {
      if (err) {
        console.error(err)
        return next(err)
      }
      if (!foundChef) {
        console.log('no chef found by this email')
        return next(err, false,
        // req.flash('flash', {
        //   type: 'warning',
        //   message: 'Wrong email. Please enter a valid email'
        // })
        req.flash('warning', 'Wrong email. Please enter a valid email'))
      }

      if (!foundChef.validPassword(givenpassword)) {
        console.log('Access denied, wrong password')
        return next(null, false, req.flash('danger', 'Access Denied, please enter the correct password'))
        // req.flash('flash', {
        //   type: 'danger',
        //   message: 'Access Denied, please enter the correct password'
        // }))
      }
      console.log(foundChef)
      return next(null, foundChef)
    })
  }))

  passport.use('local-signup-chef', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, next) { // done here is the next also
  // Find user with email as given from the callback
    Chef.findOne({'local.email': email}, function (err, foundChef) {
      console.log('foundChef is: ' + foundChef)

      if (foundChef) {
      // function(err,theNewUser, flashData)
        console.log('Chef with same email found')
        return next(null, false, req.flash('warning', 'This email is already in use'))
      //   req.flash('flash', {
      //   type: 'warning',
      //   message: 'This email is already in use'
      // }))
      } else {
    // if not found = new User
  // save user to db, password is hashed
  // call next() middleware without error arguments
        let newChef = new Chef({
          local: {
            name: req.body.name,
            Address: req.body.Address,
            email: email,
            password: Chef.encrypt(password)
          }
        })

        newChef.save(function (err, output) {
          if (err) {
            console.log('Error on new Chef:' + err)
            return next(err)
          }
          console.log('Hi new Chef')
          return next(null, newChef, req.flash('success', 'Hello new Chef ' + newChef.local.email))
        })
      }
    })
  }))
}
