const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // Ensure Index is created for uniqueness
  auth: {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit the application on connection error
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    validate: {
      validator: value => value.length >= 6 && value.length <= 40,
      message: ({ value }) => `Title must be between 6 and 40 characters, got ${value.length} characters`,
    },
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: String,
    required: [true, "Date is required"],
    validate: {
      validator: value => /\d{2}-\d{2}-\d{4}/.test(value),
      message: () => "Invalid date format, should be dd-mm-yyyy",
    },
  },
  time: {
    type: String,
    required: [true, "Time is required"],
    validate: {
      validator: value => /\d{2}:\d{2}/.test(value),
      message: () => "Invalid time format, should be hh:mm",
    },
  },
  category: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: false,
    default: "/",
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

const router = express.Router();
const path = require("path");

// Rest of your routes and middleware...

// Export the router for use in other files
module.exports = router;
