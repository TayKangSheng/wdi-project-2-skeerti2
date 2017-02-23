var express = require('express')
router = express.Router()
var chefController = require('../controllers/chefs_controller')
var postController = require('../controllers/post_controller')
var Chef = require('../models/chef')
var isLoggedIn = require('../middleware/isLoggedIn')

// router.get('/', function (req, res) {
// res.send('welcome to the chefs page!')
// })
// router.get('/signup-chef', chefController.signup)
router.get('/signin-chef', function (req, res) {
  res.render('homepage-chef')
})

router.get('/logged-chef', chefController.profileChef)
router.get('/profileEdit/:id', chefController.showChefEditForm)
router.put('/:id', chefController.updateChef)

// router.post('/logged-chef', chefController.createChef)
router.get('/', isLoggedIn, chefController.list)
router.get('/:id', isLoggedIn, chefController.show)
router.post('/cuisines', isLoggedIn, chefController.listByCuisine)
router.post('/favChef', isLoggedIn, chefController.listByFavChef)
// router.get('/:id', postController.list)
router.post('/:id', isLoggedIn, postController.create)

module.exports = router
