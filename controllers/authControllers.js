const models = require("../data/dbSchemas.js");

function getAdmin(req, res) {
    const csrfToken = req.csrfToken()
    if (req.session.isAuthenticated === true) {
        res.render("admin", { csrfToken: csrfToken });
    } else {
        res.redirect("/login");
    };
};

function postAdmin(req, res) {
    if (req.session.isAuthenticated === true) {
        const post = new models.Post ({
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
};

function postLogin(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    models.User.findOne({ email: email }, (err, user) => {
        if (err || !user ||  user.password !== password) {
            res.redirect("/login");
        }
        req.session.isAuthenticated = true;
        req.session.save(() => {
            res.redirect("/admin");
        });
    });
};

function logout(req, res) {
    req.session.isAuthenticated = false;
    req.session.save(() => {
        res.redirect("/login");
    });
};

module.exports = {
    getAdmin:getAdmin,
    postAdmin: postAdmin,
    postLogin: postLogin,
    logout:logout
};