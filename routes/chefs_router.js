var express = require('express')
router = express.Router()
var chefController = require('../controllers/chefs_controller')
var postController = require('../controllers/post_controller')
var Chef = require('../models/chef')
var isLoggedIn = require('../middleware/isLoggedIn')
var isLoggedInChef= require('../middleware/isLoggedInChef')

// router.get('/', function (req, res) {
// res.send('welcome to the chefs page!')
// })
// router.get('/signup-chef', chefController.signup)
router.get('/signin-chef', function (req, res) {
  res.render('homepage-chef')
})

router.get('/logged-chef', isLoggedInChef, chefController.profileChef)
router.get('/profileEdit/:id', isLoggedInChef, chefController.showChefEditForm)
router.put('/:id', isLoggedInChef, chefController.updateChef)
router.delete('/profileEdit/:id', isLoggedInChef, chefController.delete)

// router.post('/logged-chef', chefController.createChef)
router.get('/', isLoggedIn, chefController.list)
router.get('/:id', isLoggedIn, chefController.show)
router.post('/cuisines', isLoggedIn, chefController.listByCuisine)
router.post('/favChef', isLoggedIn, chefController.listByFavChef)
// router.get('/:id', postController.list)
router.post('/:id', isLoggedIn, postController.create)
router.get('/:id/checkout', isLoggedIn, chefController.checkoutPage)


module.exports = router
