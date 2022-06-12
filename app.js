// Require all project dependencies
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const routes = require("./modules/routes.js");

// Create and configure Express application and basic middleware
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Configure MongoDB connection
const options = {
  user: process.env.APP_USER,
  pass: process.env.APP_PASSWORD,
  authSource: process.env.AUTH_SOURCE,
  useNewUrlParser: true
};

const connectionString = `${process.env.DB_URI}/${process.env.DB_NAME}`;
mongoConnection = mongoose.connect(connectionString, options);

//  Configure session and session store using existing Mongo connection
const session = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: (1000 * 60 * 10)
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      crypto: {
        secret: process.env.SESSION_SECRET
      }
    })
}

app.use(expressSession(session));

// Trust first proxy and serve secure cookies if in production environment (application won't work correctly without server certificate)
if (process.env.ENV === 'production') {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
} else {
    console.log("Starting in development, cookie security settings disabled");
};

// Configure router middleware
app.use("/", routes.router);

// Configure server port
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});