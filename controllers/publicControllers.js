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
    models.Post.findOne({_id: requestedPostId}, (err, post) => {
        if (!err) {
            res.render("post", {
                title: post.title,
                content: post.content,
                username: post.author,
                date: post.publishedOn 
            });
        } else {
            console.log("Cannot load the post.");
        }; 
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