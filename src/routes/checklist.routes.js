const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklist.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../config/constants");

router.post("/createOrUpdateChecklist", authenticate, authorize(ROLES.PROCUREMENT), checklistController.createOrUpdateChecklistByClientEmail);
router.get("/getClientChecklists", authenticate, authorize(ROLES.PROCUREMENT), checklistController.getClientChecklists);
router.get("/getChecklistForOrder/:orderId", authenticate, authorize(ROLES.INSPECTION), checklistController.getChecklistForOrder);
router.get("/getChecklistsByProcurementManager", authenticate, authorize(ROLES.PROCUREMENT), checklistController.getChecklistsByProcurementManager);
module.exports = router;
