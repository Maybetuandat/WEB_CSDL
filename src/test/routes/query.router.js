const express = require("express");
const router = express.Router();
const queryController = require("../controllers/query.controllers");

router.get("/", queryController.executeQuery);
router.post("/execute", queryController.postUserQuery);

module.exports = router;
