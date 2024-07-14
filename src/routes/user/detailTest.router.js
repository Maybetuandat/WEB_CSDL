const express = require("express");
const router = express.Router();

router.get("/:testId", (req, res)=>{
    res.render("user/pages/test_list/detailTest.pug")
})

module.exports = router;