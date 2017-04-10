require('dotenv').config({silent: true})
var express = require('express')
var path = require('path')
// var debug = require('debug')
// var logger = require('morgan')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts')
var app = express()
var router = express.Router()
var methodOverride = require('method-override')
var passport = require('passport')

// all you need for flash data
var session = require('express-session')
var flash = require('connect-flash')
var cookieParser = require('cookie-parser')

// connect-mongo needs session its put after cookie parser
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

app.use(express.static('public'))

app.use(cookieParser('process.env.SESSION_SECRET'))
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}))
// initialize passport into your application
app.use(passport.initialize())
app.use(passport.session())
require('./config/ppConfig')(passport)
app.use(flash())

app.use(methodOverride('_method'))
// app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
// app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
// app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))

const port = process.env.PORT || 3000

var Chef = require('./models/chef')
var Dish = require('./models/dish')
var User = require('./models/user')

app.use(function (req, res, next) {
  // console.log('req.user is: ' +req.user)
  res.locals.alert = req.flash()
  res.locals.user = req.user
  // to be used as a check for navbar conditions for Chef & User accounts
  res.locals.isCustomer = req.user instanceof User
  res.locals.isChef = req.user instanceof Chef
  // console.log('res.locals.user is '+res.locals.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})
// var session = require('express-session')

var isLoggedIn = require('./middleware/isLoggedIn')
var isLoggedInChef = require('./middleware/isLoggedInChef')
// app.use(isLoggedIn)
function isNotLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  else {
  // req.flash('flash', {
  //   type: 'danger',
  //    message: 'please log in'
  //  })
    req.flash('danger', 'please log in')
    res.redirect('/login')
  }
}

const UserRouter = require('./routes/user_router')
// the homepage -> localhost:3000
app.get('/', function (req, res) {
  if (req.isAuthenticated() === true) {
    req.flash('warning', 'You have already logged in')
    if (req.user instanceof User) {
      res.redirect('/homepage')
    } else {
      res.redirect('/chefs/logged-chef')
    }
  } else {
    res.render('auth/login')
  }
})

// for sign-up of the chef
app.get('/signup-chef', function (req, res) {
  if (req.isAuthenticated() === true) {
    req.flash('warning', 'You have already signed-up')
    if (req.user instanceof Chef) {
      res.redirect('/chefs/logged-chef')
    } else {
      res.redirect('/homepage')
    }
  } else {
    res.render('auth/sign-in-chef')
  }
})
// for the form submission of chef to create a chef account and perfrom authentication
app.post('/chefs/signin-chef', function (req, res, next) {
  console.log('/chefs/signin-chef')
  var signupStrategy = passport.authenticate('local-signup-chef', { // it will look for 'local-signup-chef in passport strategy in passportConfig'
    successRedirect: '/chefs/logged-chef', // if succesful, go to '/' and so on
    failureRedirect: '/signup-chef',
    failureFlash: true // if some error in signup, say something is wrong
  })
  // the signupStrategy being called here and now goes to ppConfig callback function for local-signup-chef
  return signupStrategy(req, res, next)
})
// for the login of an existing chef
app.get('/login-chef', function (req, res) {
  if (req.isAuthenticated() === true) {
    req.flash('warning', 'You are already logged in')
    if (req.user instanceof Chef) {
      res.redirect('/chefs/logged-chef')
    } else {
      res.redirect('/homepage')
    }
  } else {
    console.log('inside the login-chef get')
    res.render('auth/login-chef')
  }
})

// go to chefs/logged-chefs once the chef authentication is successful
app.post('/chefs/logged-chef', function (req, res, next) {
  console.log('inside log in chef post')
  var loginStrategy = passport.authenticate('local-login-chef', { // it will look for 'local-login-chef in passport strategy in passportConfig'
    successRedirect: '/chefs/logged-chef', // if succesful, go to '/' and so on
    failureRedirect: '/login-chef',
    failureFlash: true // if some error in signup, say something is wrong
  })
  return loginStrategy(req, res, next) // callback function in ppConfig is called
})

// USER
// for the sign-up of a User, get the page
app.get('/signup', function (req, res) {
  if (req.isAuthenticated() === true) {
    console.log("User/Chef is already logged in. Redirect with flash message.")
    req.flash('warning', 'You have already signed up')
    if (req.user instanceof User) {
      res.redirect('/homepage')
    } else {
      res.redirect('/chefs/logged-chef')
    }
  } else {
    res.render('auth/signup')
  }
})
// in the sign-up page, now fill the sign up form. when customer fills in sighnup form and clicks submit,
// post request is sent to the server with url /signup. This request is handled in below code snippet.
// Go to /homepage once authentication of user is succesful
app.post('/signup', function (req, res, next) {
  var signupStrategy = passport.authenticate('local-signup-user', { // it will look for 'local-signup in passport strategy in passportConfig'
    successRedirect: '/homepage', // if succesful, go to '/' and so on
    failureRedirect: '/signup',
    failureFlash: true // if some error in signup, say something is wrong
  })
  return signupStrategy(req, res, next)
})

// performs the login functionalitites of the user
app.use('/login', UserRouter)

/* ---------------------------------------------- all routes from now on will check if user is logged in ------- */

// app.use(isLoggedIn)

app.get('/homepage', isLoggedIn, function (req, res) {
  res.render('homepage')
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

app.use('/chefs', require('./routes/chefs_router'))

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// when public uses the website from Heroku (production env), they shouldnt be able to see the stack trace
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(port, function () {
  console.log('kitchen wonders is running on port' + port)
})
