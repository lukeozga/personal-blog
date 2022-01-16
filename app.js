// ---------------------- Require all necessary project's dependencies --------------------------
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

// ------------------ Create and configure express application ----------------------
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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

// --------------------- Configure MongoDB connection ------------------------
const options = {
  user: process.env.APP_USER,
  pass: process.env.APP_PASSWORD,
  authSource: process.env.AUTH_SOURCE,
  useNewUrlParser: true
};

const connectionString = process.env.DB_URL

mongoose.connect(connectionString, options);

// --------------------------------- Configure session -----------------------------

// Define session object, maxAge in miliseconds - default 10 minutes
var session = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    maxAge: (1000 * 60 * 10)
  }
}

// Trust first proxy and serve secure cookies if in production environment (application won't work correctly without server certificate)
if (process.env.ENV === 'production') {
  app.set('trust proxy', 1) 
  session.cookie.secure = true
} else {
  console.log("Starting in development, cookie security settings disabled");
};

// Define authentication mechanism
passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password"
},
  (username, password, done) => {
    User.findOne({ email: username }, function (err, user) {
        if (err) { 
          return done(err); 
        }
        if (!user) {
           return done(null, false, { message: 'User does not exists.' }); 
          }
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' }); 
        }
        return done(null, user);
      });
  }
));

// Enable user serialization and deserialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
 
// Set express session, enable passport and tell it to use express session
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

// ---------------------- Define pages content ------------------------
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// ------------------------- Create routes ---------------------------
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

app.post("/login", passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: "/admin"
}));

app.get("/admin", (req, res) => {
  if (req.isAuthenticated() === true) {
    res.render("admin");
  } else {
    res.redirect("/login");
  };
})

app.post("/admin", (req, res) => {
  
  if (req.isAuthenticated() === true) {
    const post = new Post ({
      title: req.body.postTitle,
      content: req.body.postContent
    });
  
    post.save().then(() => {
      res.redirect("/");
    }).catch(function(err) {
      console.log("Error during saving the post!");
    });
  } else {
    res.redirect("/login");
  };
  
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});