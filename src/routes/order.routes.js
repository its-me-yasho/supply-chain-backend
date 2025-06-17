const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../config/constants");

router.post("/createOrder", authenticate, authorize(ROLES.PROCUREMENT),orderController.createOrder);
router.patch("/updateStatus/:id", authenticate, authorize(ROLES.PROCUREMENT), orderController.updateOrderStatus);
router.post("/submitChecklistAnswer", authenticate, authorize(ROLES.INSPECTION), orderController.submitChecklistAnswer);
router.get("/:id", authenticate, authorize(ROLES.PROCUREMENT, ROLES.INSPECTION), orderController.getOrderById);
router.get("/userOrders", authenticate, authorize(ROLES.PROCUREMENT), orderController.getOrdersForUser);
router.get("/status/:status", authenticate, authorize(ROLES.PROCUREMENT), orderController.getOrdersByStatus);

module.exports = router;
