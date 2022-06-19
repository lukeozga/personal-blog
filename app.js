// Require all project dependencies
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const mongoose = require("mongoose");
const helmet = require("helmet");

const dbConfig = require("./config/dbConfig");
const sessionConfig = require("./config/sessionConfig");
const csurf = require('csurf');
const publicRouter = require("./routes/publicRoutes");
const authRouter = require("./routes/authRoutes");
const errorHandlers = require("./middleware/errorHandlers");

// Create Express application and configure basic middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Configure view engine
app.set("view engine", "ejs");

// Initialize DB connection
const connectionString = `${process.env.DB_URI}/${process.env.DB_NAME}`;
mongoConnection = mongoose.connect(connectionString, dbConfig.createDBOptions());

mongoose.connection.on("error", err => {
  console.log("err", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is disconnected")
});

// Trust first proxy if in production environment
if (process.env.ENV === "production") {
  app.set("trust proxy", 1);
};

// Secure headers with helmet
app.use(helmet());

// Configure session
app.use(session(sessionConfig.createSessionOptions(mongoose.connection.getClient())));

// Configure CSRF protection middleware using csurf library
app.use(csurf());

// Configure importer routes
app.use(publicRouter.router);
app.use(authRouter.router);

// Add custom middleware to redirect to render "404" page if no route has 
// been found or 500 page with generic error message in case of any internal server errors
app.use(errorHandlers.pageNotFound);
app.use(errorHandlers.genericServerError);

// Configure server port
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});