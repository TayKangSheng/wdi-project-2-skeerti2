const mongoose = require('mongoose'),
  Schema = mongoose.Schema

postSchema = new mongoose.Schema({
  username: String,
  date: {type: Date, default: Date.now() },
  content: String
})

var Post = mongoose.model('Post', postSchema)
module.exports = Post
