// ------------------- Require all project dependencies ----------------------
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

const router = require("./modules/routes.js");
const models = require("./modules/models.js")
// ------------------ Create and configure express application ----------------------
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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
    models.User.findOne({ email: username }, function (err, user) {
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
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});
 
// Set express session, enable passport and tell it to use express session
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());


app.use("/", router);
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});