const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../config/constants");

router.post("/createOrder", authenticate, authorize(ROLES.PROCUREMENT),orderController.createOrder);
router.patch("/updateStatus/:id", authenticate, authorize(ROLES.PROCUREMENT), orderController.updateOrderStatus);
router.post("/submitChecklistAnswer", authenticate, authorize(ROLES.INSPECTION), orderController.submitChecklistAnswer);
router.get("/getUserOrders", authenticate, authorize(ROLES.PROCUREMENT, ROLES.INSPECTION, ROLES.CLIENT), orderController.getOrdersForUser);
router.get("/getOrdersByStatus", authenticate, authorize(ROLES.PROCUREMENT, ROLES.ADMIN), orderController.getOrdersByStatus);
router.get("/getOrderById/:id", authenticate, authorize(ROLES.PROCUREMENT, ROLES.INSPECTION), orderController.getOrderById);

module.exports = router;
