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

const port = process.env.PORT || 3000

app.use(function (req, res, next) {
  // console.log('req.user is: ' +req.user)
  res.locals.alert = req.flash()
  res.locals.user = req.user
  // console.log('res.locals.user is '+res.locals.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})
// var session = require('express-session')
var Chef = require('./models/chef')
var Dish = require('./models/dish')
var User = require('./models/user')

app.set('view engine', 'ejs')

// app.configure(function(){
//   app.use(express.bodyParser())
//     app.use(app.router)
// })
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
var isLoggedIn = require('./middleware/isLoggedIn')
//app.use(isLoggedIn)
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

// function isLoggedIn (req, res, next) {
//   if (req.isAuthenticated() === true) {
//     next()
//   } else {
//     // req.flash('flash', {
//     //   type: 'danger',
//     //   message: 'Restricted page, please log in'
//     // })
//     req.flash('danger', 'Restricted page, please log in')
//     console.log('restricted page, please log in')
//     res.redirect('/login')
//   }
// }

const UserRouter = require('./routes/user_router')
//the homepage -> localhost:3000
app.get('/', function (req, res) {
  res.render('auth/login')
})

//for sign-up of the chef
app.get('/signup-chef', function (req, res) {
  res.render('auth/sign-in-chef')
})
//for the form submission of chef to create a chef account and perfrom authentication
app.post('/chefs/signin-chef', function (req, res, next) {
  console.log('/chefs/signin-chef')
  var signupStrategy = passport.authenticate('local-signup-chef', { // it will look for 'local-signup in passport strategy in passportConfig'
    successRedirect: '/chefs/logged-chef', // if succesful, go to '/' and so on
    failureRedirect: '/signup-chef',
    failureFlash: true // if some error in signup, say something is wrong
  })

  return signupStrategy(req, res, next)
})
//for the login of an existing chef
app.get('/login-chef', function (req, res) {
  console.log('inside the login-chef get')
  res.render('auth/login-chef')
})

app.post('/chefs/logged-chef', function (req, res, next) {
  console.log('inside log in chef post')
  var loginStrategy = passport.authenticate('local-login-chef', { // it will look for 'local-signup in passport strategy in passportConfig'
    successRedirect: '/chefs/logged-chef', // if succesful, go to '/' and so on
    failureRedirect: '/login-chef',
    failureFlash: true // if some error in signup, say something is wrong
  })
  return loginStrategy(req, res, next)
})


//USER
//for the sign-up of a User, get the page
app.get('/signup', function (req, res) {
  res.render('auth/signup')
})
//in the sign-up page, now fill the sign up form
app.post('/signup', function (req, res, next) {
  var signupStrategy = passport.authenticate('local-signup-user', { // it will look for 'local-signup in passport strategy in passportConfig'
    successRedirect: '/homepage', // if succesful, go to '/' and so on
    failureRedirect: '/signup',
    failureFlash: true // if some error in signup, say something is wrong
  })
  return signupStrategy(req, res, next)
})

//performs the login functionalitites of the user
app.use('/login', UserRouter)

/* ---------------------------------------------- all routes from now on will check if user is logged in ------- */

// app.use(isLoggedIn)

app.get('/homepage', isNotLoggedIn, function (req, res) {
  res.render('homepage')
})

app.get('/logout', isLoggedIn, function (req, res) {
  req.logout()
  res.redirect('/login')
})

app.use('/chefs', require('./routes/chefs_router'))

var dish1 = new Dish({
  'dishName': 'Thai Green Curry',
  'ingredients': 'Rice, vegetables, coconut milk, spices',
  'cost': 15,
  'prepTime': 25
})
//dish1.save()

var dish2 = new Dish({
  'dishName': 'Pasta',
  'ingredients': 'pasta, veggies, olive oil, jalapeneos',
  'cost': 15,
  'prepTime': 15
})
 //dish2.save()

var dish3 = new Dish({
  'dishName': 'Biriyani',
  'ingredients': 'Mixed rice dish, optional spices, optional vegetables, meats or seafood. Can be served with plain yogurt',
  'cost': 15,
  'prepTime': 20
})
 //dish3.save()

var chef1 = new Chef({
  local: {
    email: 'khateymunukutla@gmail.com',
    password: 'khatey012',
    name: 'Sruti Keerti Munukutla',
    intro: 'Cooking is the best stressbuster',
    cuisines: 'Indian, Western',
    Address: '308 Clementi Avenue 4',
    recipes: [dish1._id, dish3._id]
  }
})
//chef1.save()

var chef2 = new Chef({
  local: {
    email: 'pbgorthi@yahoo.com',
    password: 'welcome1987',
    name: 'Prashant Bhanu Gorthi',
    intro: 'Amateur cook who likes potato',
    cuisines: 'Italian',
    Address: '10 Collyer Quay',
    recipes: [dish2._id]
  }
})
//chef2.save()

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }))
app.listen(port, function () {
  console.log('kitchen wonders is running on port 3000')
})
