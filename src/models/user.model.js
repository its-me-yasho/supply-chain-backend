const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "procurement", "inspection", "client"],
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // only for inspection manager
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
