var express = require('express')
var router = express.Router()
var Chef = require('../models/chef')
var Post = require('../models/post')

var chefController = {
  list: (req, res) => {
    Chef.find({}, function (err, output) {
      if (err) {
        console.console.error(err)
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
      .populate('recipes')
      .populate('comments')
      //  .populate('comments')
      .exec(function (err, populatedChefItem) {
        if (err) {
          console.error(err)
          return
        }
      // req.params.comments.identifier = req.params.id
        console.log(populatedChefItem)
              // console.log(req.params.comments)
        res.render('chefs/show', {chefItem: populatedChefItem})
      })
  },

  listByCuisine: (req, res) =>{
    Chef.find({"cuisines": {$regex: req.body.search_query, $options: 'i'}}, function(err, output){
      if(err){
        console.error(err)
        return
      }
      res.render('chefs/index', {chefList: output})
    })
  },

  listByFavChef: (req, res) =>{
    Chef.find({"name": {$regex: req.body.search_query_name, $options: 'i'}}, function(err, output){
      if(err){
        console.error(err)
        return
      }
      res.render('chefs/index', {chefList: output})
    })
  }
}
module.exports = chefController
