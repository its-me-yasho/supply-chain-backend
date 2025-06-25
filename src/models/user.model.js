const mongoose = require("mongoose");
const { ROLES, MODEL_NAMES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER},
    reportTo: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
  },
  { timestamps: true }
);

module.exports = mongoose.model(MODEL_NAMES.USER, userSchema);
