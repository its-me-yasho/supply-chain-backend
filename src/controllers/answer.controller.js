const Checklist = require("../models/checklist.model");
const Order = require("../models/order.model");
const ChecklistAnswer = require("../models/checklistAnswer.model");

exports.submitChecklistAnswer = async (req, res) => {
  const { orderId, responses } = req.body;
  const user = req.user;

  if (user.role !== "inspection") {
    return res.status(403).json({ message: "Only inspection managers can submit answers." });
  }

  try {
    const order = await Order.findById(orderId).populate("checklist");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Snapshot the checklist to prevent future edits from affecting answers
    const checklistSnapshot = order.checklist.questions.map(q => ({
      question: q.question,
      type: q.type,
      options: q.options,
      required: q.required
    }));

    // Validate required questions
    for (const question of checklistSnapshot) {
      if (question.required) {
        const found = responses.find(r => r.question === question.question);
        if (!found || found.answer === undefined || found.answer === null || found.answer === "") {
          return res.status(400).json({ message: `Missing required answer for: ${question.question}` });
        }
      }
    }

    const answerDoc = new ChecklistAnswer({
      orderId,
      inspectionManagerId: user._id,
      checklistSnapshot,
      responses
    });

    await answerDoc.save();

    res.status(201).json({ message: "Checklist submitted successfully", answerId: answerDoc._id });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};
