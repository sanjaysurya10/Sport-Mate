const express = require("express");
const router = express.Router();
const {
  createBooking,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/", getAllBookings);

module.exports = router;