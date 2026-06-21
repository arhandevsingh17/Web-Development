// utils/csvExport.js
// Converts an array of vehicle documents into CSV text

function generateCSV(vehicles) {
  const headers = ["ID", "Vehicle Name", "Company", "Model", "Price", "Color"];
  const rows = vehicles.map((v) =>
    [v._id, v.vehicleName, v.company, v.model, v.price, v.color]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

module.exports = { generateCSV };
