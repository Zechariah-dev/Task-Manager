const { Schema, model } = require("mongoose");

const TaskSchema = new Schema(
  {
    task: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Task = model("tasks", TaskSchema);

module.exports = Task;
