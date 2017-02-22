var express = require('express')
var router = express.Router()
var Chef = require('../models/chef')
var Post = require('../models/post')
// var ObjectID = require('mongodb').ObjectID;

var postController = {
  create: (req, res) => {
    console.log('postController create')
    var chefId = req.params.id

    // create new Post object and save to mongoDB
    let newPost = new Post({
      username: req.user.local.email,
      date: req.body.date,
      content: req.body.users.name
    })
    newPost.save(function (err, savedPost) {
      if (err) throw err
      var savedPostId = savedPost._id
      // update list of comments in chef object with id of new comment (post)
      Chef.findByIdAndUpdate(chefId,
        {$push: {'comments': savedPostId}},
        {safe: true, upsert: true, new: true}
      )
      .populate('comments')
      .exec(function (err, populatedChefItem) {
          if (err) {
            console.error(err)
            return
          }
          res.redirect('/chefs/'+ chefId)
        }
      )
    })

    // Chef.findById(chefId)
    //     .populate('comments')
    //     .exec(function (err, populatedChefItem) {
    //       if (err) {
    //         console.error(err)
    //         return
    //       }
    //
    //       console.log(populatedChefItem)
    //       res.render('comment successful')
    //       // res.render('chefs/show', {chefItem: populatedChefItem})
    //     })
  }
}

module.exports = postController
