const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

router.post("/login",userController.login);
router.post("/register",userController.register);
router.get("/allUsers/:id");
router.post("/logout/:id");
router.post("/setavatar/:id");

module.exports = router;