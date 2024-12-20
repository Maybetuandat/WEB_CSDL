const express = require("express");
const path = require("path");
const router = express.Router();
const { isAuth, isAdmin } = require("../middleware/auth.middleware");
const {
  checkShiftForImage,
  checkListStudent,
} = require("../middleware/checkShift.middleware");

router.use(isAuth);
router.use(checkShiftForImage);
router.use(checkListStudent);
router.use(express.static(path.join(__dirname, "../../images/test")));

module.exports = router;
