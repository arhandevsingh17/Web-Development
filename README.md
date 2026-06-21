# Vehicle Management System

A simple Vehicle Management System built using Node.js, Express.js, MongoDB and EJS, following the MVC pattern. This project was converted from a static HTML/CSS/JS version into a full backend application while keeping all the original features (CRUD, Search, Sort, Statistics, Dark Mode, CSV Export).

This is a college mini-project and the UI is intentionally kept simple — basic tables, basic forms, blue and white theme. No dashboard/SaaS style design.

---

## Folder Structure

```
Vehicle-Management-System/
│
├── config/
│   └── db.js                 -> MongoDB connection setup
│
├── controllers/
│   └── vehicleController.js  -> All CRUD + export logic
│
├── middleware/
│   └── errorHandler.js       -> 404 handler, error handler, file logger
│
├── models/
│   └── Vehicle.js             -> Mongoose schema for vehicle
│
├── public/
│   ├── css/
│   │   └── style.css         -> Simple admin-panel style sheet
│   ├── js/
│   │   └── app.js            -> Client side script (fetch, search, sort, dark mode)
│   └── assets/               -> (for images/icons if needed)
│
├── routes/
│   └── vehicleRoutes.js      -> Express routes for /api/vehicles
│
├── utils/
│   └── csvExport.js          -> Helper to build CSV text
│
├── views/
│   ├── index.ejs             -> Main dashboard page
│   └── partials/
│       ├── header.ejs
│       ├── navbar.ejs
│       └── footer.ejs
│
├── logs/
│   └── app.log                -> Auto generated log file
│
├── .env                       -> Environment variables (PORT, MONGO_URI)
├── .gitignore
├── app.js                     -> Main server file
├── package.json
└── README.md
```

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Frontend:** HTML, CSS, Vanilla JS, EJS templating

---

## Vehicle Schema

| Field        | Type    | Required |
|--------------|---------|----------|
| vehicleName  | String  | Yes      |
| company      | String  | Yes      |
| model        | String  | Yes      |
| price        | Number  | Yes      |
| color        | String  | Yes      |
| createdAt    | Date (auto) | -    |
| updatedAt    | Date (auto) | -    |

---

## API Routes

| Method | Endpoint               | Description              |
|--------|-------------------------|---------------------------|
| GET    | /api/vehicles           | Get all vehicles          |
| GET    | /api/vehicles/:id       | Get a single vehicle      |
| POST   | /api/vehicles           | Add a new vehicle         |
| PUT    | /api/vehicles/:id       | Update a vehicle          |
| DELETE | /api/vehicles/:id       | Delete a vehicle          |
| GET    | /api/vehicles/export/csv | Download all records as CSV |

---

## Features

- Add / Edit / Delete vehicle records (CRUD)
- Search by vehicle name, company, model, color
- Sort by vehicle name, company, or price (ascending/descending)
- Dashboard statistics: total vehicles, average price, highest price vehicle, lowest price vehicle
- Dark mode toggle (saved in browser using localStorage)
- Export all records to CSV
- Simple error handling + request logging to `logs/app.log`

---

## How to Run This Project

1. Make sure MongoDB is installed and running locally (or update `MONGO_URI` in `.env` to point to MongoDB Atlas).

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (already included) with:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/vehicle_management_db
   ```

4. Start the server:
   ```bash
   npm start
   ```
   or, for auto-restart during development:
   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

## Notes

- All data is stored in MongoDB now, instead of localStorage, so records will persist across devices and browsers.
- The UI was kept deliberately simple (blue/white admin panel look) since this is meant to look like a genuine student project, not a polished SaaS dashboard.
- This project follows MVC structure: Models (database schema), Views (EJS templates), Controllers (business logic), with routes connecting everything together.

---

*Submitted as a mini-project — Node.js + Express + MongoDB + EJS.*
