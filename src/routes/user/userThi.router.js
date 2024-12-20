const express = require("express");
const router = express.Router();

const thiController = require("../../controllers/user/thi/thi.controller");
const {
  checkShift,
  checkListStudent,
} = require("../../middleware/checkShift.middleware");

router.get("/", thiController.index);
router.get("/:testId", checkShift, checkListStudent, thiController.testWithId);
router.post("/submit", thiController.postSubmit);
router.post("/submittuluan", thiController.postSubmitTuLuan);
router.post("/submitsql", thiController.postSubmitSql);
router.post("/runsql", thiController.postRunSql);

module.exports = router;
