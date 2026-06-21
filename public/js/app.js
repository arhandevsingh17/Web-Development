// public/js/app.js
// Client-side script for Vehicle Management System
// Talks to backend via fetch() calls to /api/vehicles

let allVehicles = [];
let searchQuery = "";
let sortField = "";
let sortDir = "asc";

const tableBody = document.getElementById("tableBody");
const recordCount = document.getElementById("recordCount");

const statTotal = document.getElementById("statTotal");
const statAvg = document.getElementById("statAvg");
const statHighest = document.getElementById("statHighest");
const statLowest = document.getElementById("statLowest");

const vehicleForm = document.getElementById("vehicleForm");
const vehicleIdInput = document.getElementById("vehicleId");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchInput = document.getElementById("searchInput");
const sortFieldSelect = document.getElementById("sortField");
const sortDirSelect = document.getElementById("sortDir");

const darkModeBtn = document.getElementById("darkModeBtn");

/* ---------------- Fetch all vehicles from server ---------------- */
async function loadVehicles() {
  try {
    const res = await fetch("/api/vehicles");
    const json = await res.json();
    allVehicles = json.data || [];
    renderTable();
    renderStats();
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" class="no-data">Failed to load data. Is the server running?</td></tr>`;
    console.error(err);
  }
}

/* ---------------- Render Stats ---------------- */
function renderStats() {
  const total = allVehicles.length;
  statTotal.textContent = total;

  if (total === 0) {
    statAvg.textContent = "Rs. 0";
    statHighest.textContent = "-";
    statLowest.textContent = "-";
    return;
  }

  const prices = allVehicles.map((v) => Number(v.price));
  const avg = prices.reduce((a, b) => a + b, 0) / total;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const highestVehicle = allVehicles.find((v) => Number(v.price) === max);
  const lowestVehicle = allVehicles.find((v) => Number(v.price) === min);

  statAvg.textContent = formatPrice(avg);
  statHighest.textContent = `${highestVehicle.vehicleName} (${formatPrice(highestVehicle.price)})`;
  statLowest.textContent = `${lowestVehicle.vehicleName} (${formatPrice(lowestVehicle.price)})`;
}

function formatPrice(n) {
  return "Rs. " + Math.round(n).toLocaleString("en-IN");
}

/* ---------------- Search + Sort ---------------- */
function getFilteredList() {
  let list = [...allVehicles];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (v) =>
        v.vehicleName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q)
    );
  }

  if (sortField) {
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "price") {
        valA = Number(valA);
        valB = Number(valB);
        return sortDir === "asc" ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      const cmp = valA.localeCompare(valB);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  return list;
}

/* ---------------- Render Table ---------------- */
function renderTable() {
  const list = getFilteredList();
  recordCount.textContent = list.length;

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="no-data">No vehicle records found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = list
    .map(
      (v, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escapeHtml(v.vehicleName)}</td>
        <td>${escapeHtml(v.company)}</td>
        <td>${escapeHtml(v.model)}</td>
        <td>${formatPrice(v.price)}</td>
        <td><span class="color-dot" style="background:${cssColor(v.color)}"></span>${escapeHtml(v.color)}</td>
        <td>
          <button class="btn btn-edit" onclick="editVehicle('${v._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteVehicle('${v._id}')">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cssColor(name) {
  const map = {
    white: "#ffffff", black: "#222222", red: "#cc3333", blue: "#3366cc",
    green: "#339966", silver: "#c0c0c0", grey: "#888888", gray: "#888888",
    yellow: "#dddd33", orange: "#dd8833", brown: "#8b5a2b", purple: "#8855aa",
  };
  return map[(name || "").toLowerCase().trim()] || "#cccccc";
}

/* ---------------- Add / Update Vehicle ---------------- */
vehicleForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    vehicleName: document.getElementById("vehicleName").value.trim(),
    company: document.getElementById("company").value.trim(),
    model: document.getElementById("model").value.trim(),
    price: Number(document.getElementById("price").value),
    color: document.getElementById("color").value.trim(),
  };

  const id = vehicleIdInput.value;

  try {
    let res;
    if (id) {
      res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const json = await res.json();
    if (!json.success) {
      alert(json.message || "Something went wrong");
      return;
    }

    resetForm();
    await loadVehicles();
  } catch (err) {
    console.error(err);
    alert("Could not save vehicle. Check server connection.");
  }
});

function resetForm() {
  vehicleForm.reset();
  vehicleIdInput.value = "";
  formTitle.textContent = "Add New Vehicle";
  submitBtn.textContent = "Add Vehicle";
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

/* ---------------- Edit Vehicle ---------------- */
function editVehicle(id) {
  const v = allVehicles.find((item) => item._id === id);
  if (!v) return;

  vehicleIdInput.value = v._id;
  document.getElementById("vehicleName").value = v.vehicleName;
  document.getElementById("company").value = v.company;
  document.getElementById("model").value = v.model;
  document.getElementById("price").value = v.price;
  document.getElementById("color").value = v.color;

  formTitle.textContent = "Edit Vehicle";
  submitBtn.textContent = "Update Vehicle";
  cancelEditBtn.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- Delete Vehicle ---------------- */
async function deleteVehicle(id) {
  if (!confirm("Are you sure you want to delete this vehicle?")) return;

  try {
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) {
      alert(json.message || "Could not delete vehicle");
      return;
    }
    await loadVehicles();
  } catch (err) {
    console.error(err);
    alert("Could not delete vehicle. Check server connection.");
  }
}

/* ---------------- Search Listener ---------------- */
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderTable();
});

/* ---------------- Sort Listeners ---------------- */
sortFieldSelect.addEventListener("change", (e) => {
  sortField = e.target.value;
  renderTable();
});

sortDirSelect.addEventListener("change", (e) => {
  sortDir = e.target.value;
  renderTable();
});

/* ---------------- Dark Mode ---------------- */
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  darkModeBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  localStorage.setItem("vms_theme", theme);
}

darkModeBtn.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------------- Init ---------------- */
(function init() {
  const savedTheme = localStorage.getItem("vms_theme") || "light";
  applyTheme(savedTheme);
  loadVehicles();
})();
