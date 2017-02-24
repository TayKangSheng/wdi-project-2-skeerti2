var express = require('express')
var router = express.Router()
var Chef = require('../models/chef')
var Post = require('../models/post')
var Dish = require('../models/dish')

var chefController = {
  // signup: (req, res) =>{
  //   res.render('auth/sign-in-chef')
  // },

  profileChef: (req, res) => {
    Chef.findById(req.user.id, function (err, output) {
      if (err) {
        console.error(err)
        return
      }

    }).populate('local.recipes')
      .populate('local.comments')
      .exec(function(err, output2){
        if(err){
          console.error(err)
          return
        }
        console.log(output2)
    res.render('homepage-chef', {adminChefItem: output2})
    })
  },
  showChefEditForm: (req, res) => {
    Chef.findById(req.params.id, function (err, output) {
      if (err) {
        console.error(err)
        return
      }
      res.render('chefs/chefProfileEdit', {adminChefItem: output})
    })
  },
  updateChef: (req, res) => {
    let newDishObj = new Dish({
      dishName: req.body.chefs.dishName,
      cost: req.body.chefs.cost,
      ingredients: req.body.chefs.ingredients,
      prepTime: req.body.chefs.prepTime
    })

    newDishObj.save(function (err, savedDish) {
      if (err) {
        console.error(err)
        return
      }
    })
    console.log(newDishObj)
    dishId = newDishObj._id

    Chef.findByIdAndUpdate(req.params.id,
      {$set: {'local.name': req.body.chefs.name,
        'local.Address': req.body.chefs.Address,
        'local.intro': req.body.chefs.intro,
        'local.cuisines': req.body.chefs.cuisines},
        $push: {'local.recipes': dishId}},
      {safe: true, upsert: true, new: true})
        .populate('local.recipes')
        .exec(function (err, output) {
          if (err) {
            console.error(err)
            return
          }
          // console.log('the recipe output is' +output.local.recipes)
          res.redirect('/chefs/logged-chef')
        })
  },

  delete: (req, res) => {
    Chef.findByIdAndRemove(req.params.id, function (err, output) {
      if (err) {
        console.error(err)
        return
      }
      console.log('deleted item')
      res.redirect('/signup-chef')
    })
  },
  list: (req, res) => {
    Chef.find({}, function (err, output) {
      if (err) {
        console.error(err)
        return
      }
      res.render('chefs/index', {chefList: output})
      // res.send('list of all chefs here')
    })
  },
  show: (req, res) => {
    console.log('chefs_controller show')
    // Chef.findOne(req.params.name, function (err, output) {
    //   if (err) {
    //     console.error(err)
    //     return
    //   }
    //   console.log(output)
    //   output.populate('Dish')
    //         .exec(function (err, populatedOutput) {
    //           res.render('chefs/show', {chefItem: populatedOutput})
    //         })
    // })
    Chef.findById(req.params.id)
      .populate('local.recipes')
      .populate('local.comments')
      //  .populate('comments')
      .exec(function (err, populatedChefItem) {
        if (err) {
          console.error(err)
          return
        }
      // req.params.comments.identifier = req.params.id
        // console.log('populated chef item recipe is: ' + populatedChefItem)
              // console.log(req.params.comments)
        res.render('chefs/show', {chefItem: populatedChefItem})
      })
  },

  listByCuisine: (req, res) => {
    Chef.find({'local.cuisines': {$regex: req.body.search_query, $options: 'i'}}, function (err, output) {
      if (err) {
        console.error(err)
        return
      }
      console.log(output)
      res.render('chefs/index', {chefList: output})
    })
  },

  listByFavChef: (req, res) => {
    Chef.find({'local.name': {$regex: req.body.search_query_name, $options: 'i'}}, function (err, output) {
      if (err) {
        console.error(err)
        return
      }
      console.log(output)
      res.render('chefs/index', {chefList: output})
    })
  },
  checkoutPage: (req, res) => {
    res.render('chefs/placeorder')
  }
}
module.exports = chefController
