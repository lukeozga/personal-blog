const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.get("/admin", authController.getAdmin)
  
router.post("/admin", authController.postAdmin);

router.post("/login", authController.postLogin);

router.get("/logout", authController.logout);

module.exports = {
    router: router
};