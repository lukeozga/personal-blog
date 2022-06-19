const MongoStore = require('connect-mongo');

function createSessionOptions(mongooseClient) {
    let session = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          sameSite: "lax",
          maxAge: (1000 * 60 * 30),
          secure: false
        },
        store: MongoStore.create({
          client: mongooseClient,
          collectionName: "sessions",
          crypto: {
            secret: process.env.SESSION_SECRET
          }
        })
    };
    if (process.env.ENV === "production") {
      session.cookie.secure = true;
    };
    return session;
};

module.exports = {
    createSessionOptions: createSessionOptions
}