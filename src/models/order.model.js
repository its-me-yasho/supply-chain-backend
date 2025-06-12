const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    procurementManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inspectionManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    checklist: { type: mongoose.Schema.Types.ObjectId, ref: "Checklist" },
    status: {
      type: String,
      enum: ["created", "inspection_pending", "inspection_done", "confirmed", "completed"],
      default: "created",
    },
    details: { type: String }, // optional additional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
