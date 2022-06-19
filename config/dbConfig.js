function createDBOptions() {
    let options = {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
        authSource: process.env.AUTH_SOURCE,
        useNewUrlParser: true
    };
    return options
};

module.exports = {
    createDBOptions:createDBOptions
};