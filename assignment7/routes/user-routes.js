const express = require("express");
const userController = require("../controllers/usercontroller");
const router = express.Router();

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.post("/postblog", userController.postBlog);

router.get("/getuser", userController.getUser);
router.get("/getblog", userController.getBlog);

module.exports = router;