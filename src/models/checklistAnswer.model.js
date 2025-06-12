const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  inspectionManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checklistSnapshot: [
    {
      question: String,
      type: String,
      options: [String],
      required: Boolean,
    }
  ],
  responses: [
    {
      question: String,
      answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, array, image URL, etc.
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ChecklistAnswer", AnswerSchema);
