const mongoose = require("mongoose");

const connectionString = `${process.env.DB_URI}/${process.env.DB_NAME}`;

connectDB = () => {
    mongoose.connect(connectionString, {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
        authSource: process.env.AUTH_SOURCE,
        useNewUrlParser: true
    });

  return mongoClient = mongoose.connection.getClient();
};

module.exports = connectDB