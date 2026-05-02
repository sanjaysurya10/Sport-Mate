const express = require("express");
const router = express.Router();

const {
  addTurf,
  getAllTurfs,
  addUnavailableDate,
  removeUnavailableDate,
} = require("../controllers/turfController");

const { protect } = require("../middleware/authMiddleware");

// Add new turf
router.post("/", protect, addTurf);

// Get all turfs
router.get("/", getAllTurfs);

// Add closed date (calendar)
router.post("/:turfId/unavailable", protect, addUnavailableDate);

// Remove closed date
router.delete("/:turfId/unavailable", protect, removeUnavailableDate);

module.exports = router;