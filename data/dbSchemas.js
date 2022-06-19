const mongoose = require("mongoose");

// Create database schemas and models
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    publishedOn: { 
      type: Date, 
      default: Date.now
    }
});
  
const Post = mongoose.model("Post", postSchema);
  
const userSchema = {
  email: String,
  password: String,
  username: String,
}
  
const User = mongoose.model("User", userSchema);

module.exports = {
    Post: Post,
    User: User
}