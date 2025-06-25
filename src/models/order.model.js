const mongoose = require("mongoose");
const { MODEL_NAMES, ORDER_STATUSES } = require("../config/constants");

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    procurementManager: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    inspectionManager: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
    checklist: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.CHECKLIST },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.CREATED,
    },
    responses: [
      {
        question: String,
        answer: mongoose.Schema.Types.Mixed,
      }
    ],
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(MODEL_NAMES.ORDER, orderSchema);
