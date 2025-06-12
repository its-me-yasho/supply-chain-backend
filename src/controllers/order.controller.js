const Order = require("../models/order.model");
exports.createOrder = async (req, res) => {
  const { clientId, inspectionManagerId, checklistId, details } = req.body;
  const user = req.user;

  if (user.role !== "procurement") {
    return res.status(403).json({ message: "Only procurement managers can create orders." });
  }

  try {
    const newOrder = new Order({
      client: clientId,
      procurementManager: user.id,
      inspectionManager: inspectionManagerId,
      checklist: checklistId,
      details,
      status: "created",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Role-based restriction
    if (user.role === "inspection" && status !== "inspection_done") {
      return res.status(403).json({ message: "Inspection manager can only mark inspection_done" });
    }

    if (user.role === "procurement") {
      const isOwner = order.procurementManager.toString() === user._id.toString();
      if (!isOwner) return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      orderId: order._id,
      newStatus: status
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

