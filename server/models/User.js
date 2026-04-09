

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedAt: { type: Date, default: Date.now },
  deadline: { type: Date },
  completedAt: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "Planning", "Processing", "Completed"],
    default: "Pending",
  },
  // NEW: Track who assigned the task
  assignedBy: {
    name: { type: String },
    role: { type: String },
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Employee", "Lead", "Manager"],
    default: "Employee",
  },
  department: { type: String, default: "General" },
  salary: { type: Number, default: 0 },
  pulseStatus: { type: String, default: "Available" },
  lastEndorsementDate: { type: Date, default: null },

  // HIERARCHY FIELDS
  lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  performance: {
    endorsements: { type: Number, default: 0 },
    endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTasks: [TaskSchema],
  },
});

module.exports = mongoose.model("User", UserSchema);