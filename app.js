// app.js
// Entry point of the Vehicle Management System

require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");

const connectDB = require("./config/db");
const vehicleRoutes = require("./routes/vehicleRoutes");
const vehicleController = require("./controllers/vehicleController");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", vehicleController.renderDashboard);
app.use("/api/vehicles", vehicleRoutes);

// 404 + error handlers (always last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
