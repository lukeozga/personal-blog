const express = require("express");
const router = express.Router()
const passport = require("passport");
const models = require('./models')
// ------------------------- Create routes ---------------------------
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
    models.Post.findOne({_id: requestedPostId}, function(err, post) {
        if (!err) {
            res.render("post", {
                title: post.title,
                content: post.content
            });
        } else {
            console.log("Cannot load the post.")
        }; 
    });
});
  
router.get("/login", (req, res) =>{
    res.render("login");
});
  
router.post("/login", passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: "/admin"
}));
  
router.get("/admin", (req, res) => {
    if (req.isAuthenticated() === true) {
        res.render("admin");
    } else {
        res.redirect("/login");
    };
})
  
router.post("/admin", (req, res) => {
    if (req.isAuthenticated() === true) {
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
    req.logout();
    res.redirect("/login");
});

module.exports = router