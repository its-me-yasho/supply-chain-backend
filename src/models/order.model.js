const mongoose = require("mongoose");
const { MODEL_NAMES, ORDER_STATUSES } = require("../config/constants");

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    procurementManager: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    inspectionManager: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER }, // optional
    checklist: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.CHECKLIST },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.CREATED,
    },
    details: { type: String }, // optional additional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model(MODEL_NAMES.ORDER, orderSchema);
