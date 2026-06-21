// controllers/vehicleController.js
// Contains all logic for handling vehicle related requests

const Vehicle = require("../models/Vehicle");
const { generateCSV } = require("../utils/csvExport");
const { logToFile } = require("../middleware/errorHandler");

// Render the main dashboard page (index.ejs)
// Vehicles are fetched by client-side JS via /api/vehicles,
// but we still pass an initial count for the page title if needed.
exports.renderDashboard = async (req, res, next) => {
  try {
    res.render("index", { title: "Vehicle Management System" });
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles
exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles/:id
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// POST /api/vehicles
exports.createVehicle = async (req, res, next) => {
  try {
    const { vehicleName, company, model, price, color } = req.body;

    if (!vehicleName || !company || !model || !price || !color) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const vehicle = await Vehicle.create({ vehicleName, company, model, price, color });
    logToFile(`Created vehicle: ${vehicle.vehicleName} (${vehicle._id})`);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// PUT /api/vehicles/:id
exports.updateVehicle = async (req, res, next) => {
  try {
    const { vehicleName, company, model, price, color } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { vehicleName, company, model, price, color },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    logToFile(`Updated vehicle: ${vehicle.vehicleName} (${vehicle._id})`);
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    logToFile(`Deleted vehicle: ${vehicle.vehicleName} (${vehicle._id})`);
    res.status(200).json({ success: true, message: "Vehicle deleted", data: vehicle });
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles/export/csv
exports.exportCSV = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    const csv = generateCSV(vehicles);

    res.header("Content-Type", "text/csv");
    res.attachment(`vehicle-records-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
