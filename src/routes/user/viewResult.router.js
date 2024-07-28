const express = require("express");
const router = express.Router();

const controllerResult = require("../../controllers/user/result/result.controller");
// const controllerResult2 = require("../../controllers/admin/result/result.controller");
const { postSubmit } = require("../../controllers/test.controllers");
const { isAuth } = require("../../middleware/auth.middleware");

router.get("/", controllerResult.index);

router.get("/tn", controllerResult.resultTestOfStudent);
router.get("/tn/:idResult", controllerResult.detailStudentAndTest);

router.get("/test", controllerResult.test);
router.get("/test/:testId", controllerResult.testWithId);
router.get("/test/:testId/:studentId", controllerResult.detailStudentAndTest);

router.post("/submit", postSubmit);
// router.get("/:studentId/:testId", controllerResult2.detailStudentAndTest);
module.exports = router;
