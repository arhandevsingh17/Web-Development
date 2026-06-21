// routes/vehicleRoutes.js
// All routes related to Vehicle resource

const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// CSV export route (must come before /:id to avoid conflict)
router.get("/export/csv", vehicleController.exportCSV);

router.route("/")
  .get(vehicleController.getAllVehicles)
  .post(vehicleController.createVehicle);

router.route("/:id")
  .get(vehicleController.getVehicleById)
  .put(vehicleController.updateVehicle)
  .delete(vehicleController.deleteVehicle);

module.exports = router;
