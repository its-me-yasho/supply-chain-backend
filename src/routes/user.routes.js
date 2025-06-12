const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/getInspector", authenticate, authorize("procurement"), userController.getInspectorByPM);
router.post("/assignProcManager", authenticate, authorize("admin"), userController.assignInspector);
router.post("/unassignProcManager", authenticate, authorize("admin"), userController.unassignInspector);
module.exports = router;