var express = require('express')
router = express.Router()
var chefController = require('../controllers/chefs_controller')
var postController = require('../controllers/post_controller')
var Chef = require('../models/chef')

// router.get('/', function (req, res) {
// res.send('welcome to the chefs page!')
// })

router.get('/', chefController.list)
router.get('/:id', chefController.show)
// router.get('/:id', postController.list)
router.post('/:id', postController.create)

module.exports = router
