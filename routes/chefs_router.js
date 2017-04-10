var express = require('express')
router = express.Router()
var chefController = require('../controllers/chefs_controller')
var postController = require('../controllers/post_controller')
var Chef = require('../models/chef')
var isLoggedIn = require('../middleware/isLoggedIn')
var isLoggedInChef= require('../middleware/isLoggedInChef')

//the routes for chef account
router.get('/signin-chef', function (req, res) {
  res.render('homepage-chef')
})

router.get('/logged-chef', isLoggedInChef, chefController.profileChef)
router.get('/profileEdit/:id', isLoggedInChef, chefController.showChefEditForm)
router.put('/:id', isLoggedInChef, chefController.updateChef)
router.delete('/profileEdit/:id', isLoggedInChef, chefController.delete)
// router.post('/logged-chef', chefController.createChef)


//routes for User account
router.get('/', isLoggedIn, chefController.list)
router.get('/:id', isLoggedIn, chefController.show)
router.post('/cuisines', isLoggedIn, chefController.listByCuisine)
router.post('/favChef', isLoggedIn, chefController.listByFavChef)
router.post('/:id', isLoggedIn, postController.create)

router.post('/:id/checkout', isLoggedIn, function(req, res) {
  var nodemailer = require('nodemailer')
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'kitchen.wonders.ga@gmail.com', // Your email id
          pass: 'Wonder$123' // Your password
      }
  })

  var mailOptions = {
      from: 'kitchen.wonders.ga@gmail.com', // sender address
      to: req.user.local.email, // list of receivers
      subject: 'Thank you for your order', // Subject line
      text: 'Your order has been placed! Our chef will be contacting you very soon!'
  }

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error)
      }else{
          console.log('Message sent: ' + info.response)
      }
      res.render('chefs/placeorder')
  })
})

router.get('/:id/checkout', isLoggedIn, chefController.checkoutPage)




module.exports = router
