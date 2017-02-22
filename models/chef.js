var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chefSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  intro: {
    type: String
  },
  cuisines: [{type: String}],
  // do it as embedded schema
  recipes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Post'}]
  // ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}]
})

var Chef = mongoose.model('Chef', chefSchema)
module.exports = Chef
