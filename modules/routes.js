const express = require("express");
const router = express.Router();
const models = require("./models.js");

// Create routes
router.get("/", function(req, res) {
    models.Post.find({}, function(err, posts) {
        if (!err) {
            res.render("home", {
                posts: posts
            });
        } else {
            console.log("Cannot access DB.");
        }
    })
});
  
router.get("/about", function(req, res) {
    res.render("about");
});
  
router.get("/contact", function(req, res) {
    res.render("contact");
});
  
router.get("/posts/:postID", function(req, res){
    const requestedPostId = req.params.postID;
    models.Post.findOne({_id: requestedPostId}, (err, post) => {
        if (!err) {
            res.render("post", {
                title: post.title,
                content: post.content
            });
        } else {
            console.log("Cannot load the post.");
        }; 
    });
});
  
router.get("/login", (req, res) => {
    const csrfToken = req.csrfToken()
    if (req.session.isAuthenticated === true) {
        return res.redirect("/admin");
    }
    res.render("login", { csrfToken: csrfToken });
});
  
router.post("/login", (req, res) => {
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
});
  
router.get("/admin", (req, res) => {
    const csrfToken = req.csrfToken()
    if (req.session.isAuthenticated === true) {
        res.render("admin", { csrfToken: csrfToken });
    } else {
        res.redirect("/login");
    };
})
  
router.post("/admin", (req, res) => {
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
});
  
router.get("/logout", (req, res) => {
    req.session.isAuthenticated = false;
    req.session.save(() => {
        res.redirect("/login");
    });
});

module.exports = {
    router: router
}