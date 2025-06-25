const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../config/constants");

router.get("/getInspector", authenticate, authorize(ROLES.PROCUREMENT), userController.getInspectorByPM);
router.get("/getInspectorByEmail", authenticate, authorize(ROLES.ADMIN), userController.getInspectorByEmail);
router.patch("/assignProcManager", authenticate, authorize(ROLES.ADMIN), userController.assignInspector);
router.patch("/unassignProcManager", authenticate, authorize(ROLES.ADMIN), userController.unassignInspector);
module.exports = router;