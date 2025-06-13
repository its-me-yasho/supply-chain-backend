const mongoose = require("mongoose");
const { MODEL_NAMES, ANSWER_TYPES } = require("../config/constants");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(ANSWER_TYPES),
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    ubdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER},
    questions: [questionSchema],
    responses: [
      {
        question: String,
        answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, array, image URL, etc.
      }
    ],
    linkedClientId: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
  },
  { timestamps: true }
);

module.exports = mongoose.model(MODEL_NAMES.CHECKLIST, checklistSchema);
