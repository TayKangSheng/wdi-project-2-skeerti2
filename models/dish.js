var mongoose = require('mongoose'),
  Schema = mongoose.Schema

const dishSchema = new mongoose.Schema({
  dishName: String,
  ingredients: String,
  cost: Number,
  prepTime: Number
})

var Dish = mongoose.model('Dish', dishSchema)
module.exports = Dish
