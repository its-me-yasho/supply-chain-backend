const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../config/constants");

router.get("/getInspector", authenticate, authorize(ROLES.PROCUREMENT), userController.getInspectorByPM);
router.post("/assignProcManager", authenticate, authorize(ROLES.ADMIN), userController.assignInspector);
router.post("/unassignProcManager", authenticate, authorize(ROLES.ADMIN), userController.unassignInspector);
module.exports = router;