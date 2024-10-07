const express = require("express");
const router = express.Router();

const thiController = require("../../controllers/user/thi/thi.controller");

router.get("/", thiController.index);
router.get("/:testId", thiController.testWithId);
router.post("/submit", thiController.postSubmit);
router.post("/submitsql", thiController.postSubmitSql);

module.exports = router;
