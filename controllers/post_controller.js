var express = require('express')
var router = express.Router()
var Chef = require('../models/chef')
var Post = require('../models/post')
// var ObjectID = require('mongodb').ObjectID;

var postController = {
  create: (req, res, next) => {
    console.log('postController create')
    console.log('the id of current user is '+ req.user.id)
    var chefId = req.params.id
    console.log('id of the chef is' + chefId)

    // create new Post object and save to mongoDB
    let newPost = new Post({
      username: req.user.local.email,
      date: req.body.date,
      content: req.body.users.name
    })
    newPost.save(function (err, savedPost) {
      if (err) {
        console.error(err)
        return next(err)
      }
      var savedPostId = savedPost._id
      // update list of comments in chef object with id of new comment (post)
      console.log('the id of the saved post is' + savedPostId)

      Chef.findByIdAndUpdate(chefId,
        {$push: {'local.comments': savedPostId}},
        {safe: true, upsert: true, new: true}
      )
      .populate('local.comments')
      .exec(function (err, populatedChefItem) {
        if (err) {
          console.error(err)
          return next(err)
        }
        res.redirect('/chefs/' + chefId)
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
