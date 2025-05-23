const express = require("express");
const router = express.Router();

const controllerResult = require("../../controllers/admin/result/result.controller");
const {
  isAuth,
  isAdmin,
  isAdminPermission,
} = require("../../middleware/auth.middleware");

router.get("/", controllerResult.index);

router.get("/student", controllerResult.student);
router.get("/student/:studentId", controllerResult.studentWithId);
router.get(
  "/student/:studentId/:testId",
  controllerResult.detailStudentAndTest
);
router.get("/test", controllerResult.test);
router.get("/test/:testId", controllerResult.testWithId);
router.get("/test/:testId/:studentId", controllerResult.detailStudentAndTest);
router.get("/chamthi/:testId", controllerResult.chamThi);
router.get("/thi", controllerResult.thi);
router.get("/thi/:testId", controllerResult.thiWithId);
router.get("/thi/:testId/:studentId", controllerResult.detailStudentAndThi);
module.exports = router;
