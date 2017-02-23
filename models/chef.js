var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bcrypt = require('bcryptjs')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
var chefSchema = new mongoose.Schema({
  local: {
    Address: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: emailRegex
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'password must be between 8 and 99 characters'],
      maxlength: [99, 'password should be less than 99 characters']
    },
    name: {
      type: String,
      unique: true
    },
    intro: {
      type: String
    },
    cuisines: {
      type: String
    },
  // do it as embedded schema
    recipes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Post'}]
  }
  // ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}]
})


chefSchema.statics.encrypt = function (password) {
  // return 'the hashed password'
  // hash synchronously. it is a blocking system. waits till everything is done
  return bcrypt.hashSync(password, 10)
}

chefSchema.methods.validPassword = function (givenpassword) {
  return bcrypt.compareSync(givenpassword, this.local.password)
}

chefSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        // delete the password from the JSON data, and return
        delete ret.password;
        return ret;
    }
}

var Chef = mongoose.model('Chef', chefSchema)
module.exports = Chef
