const mongoose = require('mongoose'),
  Schema = mongoose.Schema
var bcrypt = require('bcryptjs')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
let UserSchema = new mongoose.Schema({
  local : {
    firstName: String,
    LastName: String,
    Address: String,
    postalCode: String,
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
    }
  }
})

// UserSchema.pre('save', function (next) {
//   var user = this
//   if (!user.isModified('password')) return next()
//   var hash = bcrypt.hashSync(user.password, 10)
//
//   user.password = hash
//   next()
// })

UserSchema.statics.encrypt = function (password) {
  // return 'the hashed password'
  // hash synchronously. it is a blocking system. waits till everything is done
  return bcrypt.hashSync(password, 10)
}

UserSchema.methods.validPassword = function (givenpassword) {
  return bcrypt.compareSync(givenpassword, this.local.password)
}

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        // delete the password from the JSON data, and return
        delete ret.password;
        return ret;
    }
}

var User = mongoose.model('User', UserSchema)
module.exports = User
