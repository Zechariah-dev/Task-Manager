const { Router } = require("express");
const Task = require("../models/Task");
const mongoose = require("mongoose");
const { isEmpty } = require("../middlewares/validation");

const { auth } = require("../middlewares/auth");

const router = Router();

router.post("/create", async (req, res) => {
  const { task } = req.body;

  try {
    if (isEmpty(task)) {
      return res.status(403).json({ msg: "task must not be empty" });
    }

    const newTask = new Task({
      task,
      owner: req.user._id
    });

    await newTask.save();

    res.status(201).json({ msg: "task created", newTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", msg: "Internal Server Error" });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: mongoose.Types.ObjectId(req.user._id)
    }).sort({ timestamps: -1 });

    if (!tasks) {
      return res.status(403).json({ msg: "No Tasks found" });
    }

    res
      .status(201)
      .json({ data: tasks, msg: "User tasks retrieved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed" });
  }
});

router.get("/:taskID", auth, async (req, res) => {
  const {
    params: { taskID }
  } = req;

  try {
    if (!taskID) {
      return res.status(401).json({ msg: "Task ID must be provided" });
    }

    const singleTask = await Task.findOne({
      _id: mongoose.Types.ObjectId(taskID)
    });

    if (!singleTask) {
      return res
        .status(403)
        .json({ msg: "Task with the provided ID not found" });
    }

    res.status(201).json({ msg: "task found", task: singleTask });
    super.sendSuccess(res, { singleTask }, "task found", 200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.patch("/:taskID", async (req, res) => {
  const { taskID } = req.params;
  const { status } = req.query;

  if (!taskID || !status) {
    return res.status(403).json({ msg: "taskID or status is missing" });
  }

  let task;

  try {
    if (status === "completed") {
      task = await Task.findByIdAndUpdate(mongoose.Types.ObjectId(taskID), {
        $set: { completed: true }
      });
    } else {
      task = await Task.findByIdAndUpdate(mongoose.Types.ObjectId(taskID), {
        $set: { completed: false }
      });
    }

    res.status(201).json({ msg: "task updated", task });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/:taskID", async (req, res) => {
  const { taskID } = req.params;

  if (!taskID) {
    return res.status(403).json({ msg: "taskID is missing" });
  }

  try {
    const task = await Task.findById(mongoose.Types.ObjectId(taskID));

    if (!task) {
      return res
        .status(403)
        .json({ msg: "No task  with the provided ID found" });
    }

    await task.remove();

    res.status(201).json({ msg: "Task deleted", task });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
