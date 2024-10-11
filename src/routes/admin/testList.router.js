const express = require("express");
const router = express.Router();
const fileUploader = require("../../config/cloudinary.config");
const controllerViewTest = require("../../controllers/admin/test/test.controller");
const { isAdminPermission } = require("../../middleware/auth.middleware");
// router.get("/", controllerViewTest.index);
const { isAdmin } = require("../../middleware/auth.middleware");
router.get("/new-test", isAdmin, controllerViewTest.createNewTest);
router.get("/", controllerViewTest.testListPaginate);
router.get("/edit-test/:id", controllerViewTest.EditTest);

router.post(
  "/cloudinary-upload",
  fileUploader.single("file"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    var response = {
      img_url: req.file.path,
    };

    res.status(200).json(response);
  }
);

module.exports = router;
