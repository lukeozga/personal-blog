// Require all necessary project's dependencies 
const express = require("express");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require("mongoose");

// Create and configure express application
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define necessary variables
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Configure MongoDB connection
const options = {
  user: process.env.APP_USER,
  pass: process.env.APP_PASSWORD,
  authSource: process.env.AUTH_SOURCE,
  useNewUrlParser: true
};

const connectionString = process.env.DB_URL

mongoose.connect(connectionString, options);

// Create post schema and model
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

// Create routes
app.get("/", function(req, res) {
  
  Post.find({}, function(err, posts) {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts
        });
    } else {
      console.log("Cannot access DB.");
    }
  })
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/posts/:postID", function(req, res){
  
  const requestedPostId = req.params.postID;
  Post.findOne({_id: requestedPostId}, function(err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      console.log("Cannot load the post.")
    }; 
  });
});

app.get("/login", (req, res) =>{
  res.render("login");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("compose");
        };
      };
    };
  });
});

app.post("/compose", function(req, res) {
  
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  post.save().then(function () {
    res.redirect("/");
  }).catch(function(err) {
    console.log("Error during saving the post!");
  });
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT, function() {
  console.log(`Server started on port ${process.env.PORT}`);
});