const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const auth = require("../../controllers/auth.controllers");

router.get("/", auth.indexLogin);
router.post("/checkLoginUser", auth.checkLoginUser);
router.get("/register", auth.indexRegister);
router.post("/register/createNewUser", auth.createUser);
router.get("/forgotPassword", auth.indexForgotPassword);
router.post("/forgotPassword/resetPassword", auth.forgotPassword);
router.post("/forgotPassword/verifyOTP", auth.verifyOTP);
router.post("/forgotPassword/changePassword", auth.changePassword);
module.exports = router;
