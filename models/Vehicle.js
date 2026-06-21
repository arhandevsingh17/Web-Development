// models/Vehicle.js
// Mongoose schema for a Vehicle document

const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
