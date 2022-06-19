const models = require("../data/dbSchemas.js");

function getHome(req, res) {
    models.Post.find({}, function(err, posts) {
        if (!err) {
            res.render("home", {
                posts: posts
            });
        } else {
            console.log("Error during fetching posts.");
        }
    })
};

function getAbout(req, res) {
    res.render("about");
};

function getContact(req, res) {
    res.render("contact");
};

function getPost(req, res){
    const requestedPostId = req.params.postID;
    res.render("post", {
        title: post.title,
        content: post.content
    });
};

function getLogin(req, res) {
    const csrfToken = req.csrfToken()
    if (req.session.isAuthenticated === true) {
        return res.redirect("/admin");
    }
    res.render("login", { csrfToken: csrfToken });
};

module.exports = {
    getHome: getHome,
    getAbout: getAbout,
    getContact: getContact,
    getPost: getPost,
    getLogin: getLogin
};