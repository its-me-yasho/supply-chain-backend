const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ["boolean", "single_choice", "multiple_choice", "text", "image", "dropdown"],
      required: true,
    },
    options: [String], // for choice/dropdown types
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const checklistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ubdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [questionSchema],
    linkedClientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // if reused
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", checklistSchema);
