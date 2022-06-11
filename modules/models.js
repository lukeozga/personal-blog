const mongoose = require("mongoose");

// ------------------------ Create database schemas and models ----------------------
const postSchema = {
    title: String,
    content: String
  };
  
  const Post = mongoose.model("Post", postSchema);
  
  const userSchema = {
    email: String,
    password: String
  }
  
  const User = mongoose.model("User", userSchema);

module.exports = {
    Post: Post,
    User: User
}