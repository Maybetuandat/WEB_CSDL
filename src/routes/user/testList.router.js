const express = require("express");
const router = express.Router();
const fileUploader = require("../../config/cloudinary.config");
const controllerViewTest = require("../../controllers/admin/test/test.controller");

// router.get("/", controllerViewTest.index);
router.get("/new-test", controllerViewTest.createNewTestUser);
router.get("/", controllerViewTest.testListPaginateUser);
router.get("/edit-test/:id", controllerViewTest.UserEditTest);

router.post(
  "/cloudinary-upload1",
  fileUploader.single("file"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    //console.log(req.file.path);

    var response = {
      img_url: req.file.path,
    };

    res.status(200).json(response);
  }
);

router.use((err, req, res, next) => {
  console.error("lỗi:", err.stack);
  res.status(500).send({
    message: err.message,
    error: err,
  });
});

module.exports = router;
