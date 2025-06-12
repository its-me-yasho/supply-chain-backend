const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklist.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.post("/createOrUpdateChecklist", authenticate, authorize("procurement"), checklistController.createOrUpdateChecklistByClientEmail);
router.get("/getClientChecklists", authenticate, authorize("procurement"), checklistController.getClientChecklists);

module.exports = router;
