const Checklist = require("../models/checklist.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");


exports.createOrUpdateChecklistByClientEmail = async (req, res) => {
    const { title, questions, linkedClientEmail } = req.body;
    const creator = req.user;

    try {
        if (!title || !questions || !linkedClientEmail) {
            return res.status(400).json({ message: "Title, questions, and linked client email are required" });
        }

        const client = await User.findOne({ email: linkedClientEmail, role: "client" });
        if (!client) {
            return res.status(404).json({ message: "Linked client not found" });
        }

        let checklist = await Checklist.findOne({ title, linkedClientId: client._id });

        if (checklist) {
            if (checklist.createdBy.toString() !== creator.id) {
                return res.status(403).json({ message: "You are not authorized to update this checklist" });
            }
            checklist.title = title;
            checklist.ubdatedBy = creator.id;
            if (JSON.stringify(checklist.questions) === JSON.stringify(questions)) {
                return res.status(200).json({ message: "No changes made to the checklist", checklist });
            }
            checklist.questions = checklist.questions.map((q, index) => {
                if (questions[index]) {
                    return { ...q, ...questions[index] }; 
                }
                return q;
            });
            if (questions.length > checklist.questions.length) {
                const newQuestions = questions.slice(checklist.questions.length);
                checklist.questions.push(...newQuestions);
            }
            await checklist.save();
            return res.status(200).json({ message: "Checklist updated", checklist });
        } else {
            checklist = new Checklist({
                title,
                questions,
                createdBy: creator.id,
                linkedClientId: client._id,
            });
            await checklist.save();
            return res.status(201).json({ message: "Checklist created", checklist });
        }
    } catch (err) {
        res.status(500).json({ message: "Error processing checklist", error: err.message });
    }
};

exports.getChecklistsByLoggedPM = async (req, res) => {
  const user = req.user;
  try {
    const checklists = await Checklist.find({ createdBy: user.id }).populate('linkedClientId', 'name email role');
    if (!checklists || checklists.length === 0) {
      return res.status(404).json({ message: "No checklists found for this user" });
    }
    res.status(200).json({ checklists });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch checklists", error: err.message });
  }
};


exports.getClientChecklists = async (req, res) => {
  const { clientEmail } = req.body;
  try {
    if (!clientEmail) {
      return res.status(400).json({ message: "Client email is required" });
    }
    const client = await User.findOne({ email: clientEmail, role: "client" });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    const checklists = await Checklist.find({ linkedClientId: client._id }).populate('linkedClientId', 'name email role');
    res.status(200).json({ checklists });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch checklists", error: err.message });
  }
};

exports.getChecklistForOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('checklist');
    if (!order) return res.status(404).json({ message: "Order not found" });

    const checklist = order.checklist;
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    res.status(200).json({ checklist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
