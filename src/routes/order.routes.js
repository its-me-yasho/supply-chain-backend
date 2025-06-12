const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/", authenticate, orderController.createOrder);
router.patch("/:id/status", authenticate, orderController.updateOrderStatus);

module.exports = router;
