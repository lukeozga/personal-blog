const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicControllers");

router.get("/", publicController.getHome);
  
router.get("/about", publicController.getAbout);
  
router.get("/contact", publicController.getContact);
  
router.get("/posts/:postID", publicController.getPost);
  
router.get("/login", publicController.getLogin);
  
module.exports = {
    router: router
};