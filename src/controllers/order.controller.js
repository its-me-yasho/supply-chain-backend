const Order = require("../models/order.model");
const Checklist = require("../models/checklist.model");
const User = require("../models/user.model");
const { ROLES, ORDER_STATUSES } = require("../config/constants");

exports.createOrder = async (req, res) => {
  const { clientEmail, inspectionManagerEmail, details } = req.body;
  const user = req.user;

  try {
    const client = await User.findOne({ email: clientEmail, role: ROLES.CLIENT });
    const inspectionManager = await User.findOne({ email: inspectionManagerEmail, role: ROLES.INSPECTION });
    const checklist = await Checklist.findOne({ linkedClientId: client._id });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (!inspectionManager) {
      return res.status(404).json({ message: "Inspection manager not found" });
    }
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found for this client" });
    }
    const newOrder = new Order({
      client: client._id,
      procurementManager: user.id,
      inspectionManager: inspectionManager._id,
      checklist: checklist._id,
      details,
      responses: [],
      status: ORDER_STATUSES.INSPECTION_PENDING,
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

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

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

exports.submitChecklistAnswer = async (req, res) => {
  const { orderId, responses } = req.body;
  const user = req.user;

  try {
    const order = await Order.findById(orderId).populate("checklist");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== ORDER_STATUSES.INSPECTION_PENDING) {
      return res.status(400).json({ message: "Order is not in inspection pending status" });
    }

    // Validate required questions
    const validation = exports.validateChecklistSchema(order.checklist, responses);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    order.responses = responses;
    order.status = ORDER_STATUSES.INSPECTION_DONE;

    await order.save();

    res.status(201).json({ message: "Checklist answer submitted successfully", orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};


// fuction to validate the checklist schema with provided answers like question, type, options, required
exports.validateChecklistSchema = (checklist, responses) => {
  const responseMap = new Map(responses.map(r => [r.question, r.answer]));

  for (const question of checklist.questions) {
    if (question.required && !responseMap.has(question.question)) {
      return { valid: false, message: `Missing required answer for: ${question.question}` };
    }
    const answer = responseMap.get(question.question);
    const typeValidators = {
      "multiple-choice": ans => question.options.includes(ans),
      "dropdown": ans => question.options.includes(ans),
      "single-choice": ans => question.options.includes(ans),
      "text": ans => typeof ans === "string",
      "string": ans => typeof ans === "string",
      "number": ans => typeof ans === "number",
      "boolean": ans => typeof ans === "boolean",
      "image": ans =>
        (typeof ans === "string" && /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(ans))
    };

    const validator = typeValidators[question.type];
    if (validator && !validator(answer)) {
      return {
        valid: false,
        message: `Invalid answer for ${question.question}. Expected type: ${question.type}${question.options ? `, options: ${question.options.join(", ")}` : ""}.`
      };
    }
  }

  return { valid: true };
};

//get order by id
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("client", "name email")
      .populate("procurementManager", "name email")
      .populate("inspectionManager", "name email")
      .populate("checklist");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// Get all orders with respect to status
exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    const orders = await Order.find({ status })
      .populate("client", "name email")
      .populate("procurementManager", "name email")
      .populate("inspectionManager", "name email")
      .populate("checklist");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// Get all orders for a user
exports.getOrdersForUser = async (req, res) => {
  const user = req.user;

  try {
    const orders = await Order.find({
      $or: [
        { client: user._id },
        { procurementManager: user._id },
        { inspectionManager: user._id }
      ]
    })
      .populate("client", "name email")
      .populate("procurementManager", "name email")
      .populate("inspectionManager", "name email")
      .populate("checklist");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

