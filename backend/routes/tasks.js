const express = require("express");
const Tasks = require("../models/task");
const multer = require("multer");
const router = express.Router();
const path = require("path");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, msg: 'Something went wrong' });
};

// Get all tasks
router.get("/", async (req, res, next) => {
    try {
        const tasks = await Tasks.find();
        res.json({ success: true, data: tasks });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
});

// Get a task by ID
router.get("/:id", async (req, res, next) => {
    try {
        const task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, data: "Task not found" });
        }
        return res.json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
});

// Get tasks by date
router.get("/date/:day/:month/:year", async (req, res, next) => {
    try {
        const taskDate = await Tasks.find({
            dueDate: `${req.params.day}/${req.params.month}/${req.params.year}`,
        });
        if (taskDate) {
            return res.json({ success: true, data: taskDate });
        }
        return res.json({ success: false, data: "Task not found" });
    } catch (error) {
        next(error);
    }
});

// Add a new task
router.post("/add", async (req, res, next) => {
    try {
        await Tasks.create(req.body);
        return res.status(200).json({ success: true, msg: "Task created successfully" });
    } catch (error) {
        if ("errors" in error) {
            let errors = [];
            Object.keys(error.errors).forEach((err) => {
                errors.push(error.errors[err].message);
            });
            return res.json({ success: false, msg: errors });
        } else {
            next(error);
        }
    }
});

// Image upload
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../frontend/task-manager-app/public/images");
    },
    filename: async (req, file, cb) => {
        const task = await Tasks.findOne().sort({ _id: -1 });
        try {
            await Tasks.updateOne(
                { _id: task.id },
                { path: "images/" + task.id + ".png" }
            );
        } catch (error) {
            next(error);
        }
        cb(null, task.id + ".png");
    },
});
const upload = multer({ storage: storageEngine });
router.post("/upload", upload.single("image"), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: "No file uploaded" });
        }
        res.status(200).json({ success: true, msg: "Image uploaded successfully!" });
    } catch (error) {
        next(error);
    }
});

// Update a task by ID
router.put("/:id", async (req, res, next) => {
    try {
        const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedTask) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }
        return res.json({
            success: true,
            msg: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        next(error);
    }
});

// Delete a task by ID
router.delete("/:id", async (req, res, next) => {
    try {
        const deletedTask = await Tasks.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }
        return res.json({ success: true, msg: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// Use the error handling middleware for all routes
router.use(errorHandler);

module.exports = router;
