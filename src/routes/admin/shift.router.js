const express = require("express");
const router = express.Router();
const fileUploader = require("../../config/cloudinary.config");
const controllerShift = require("../../controllers/admin/shift.controller");

const { isAdmin } = require("../../middleware/auth.middleware");

router.get("/", controllerShift.shiftListPaginate);
router.get("/new", controllerShift.createNewShift);
router.get("/edit/:id", controllerShift.editShift);
router.post("/api/edit-shift", controllerShift.updateShift);
router.post("/api/new-shift", controllerShift.createShift);
router.post("/api/delete-shift", controllerShift.deleteShift);
module.exports = router;
