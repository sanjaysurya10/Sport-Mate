const express = require("express");
const router = express.Router();
const { addTurf, getAllTurfs } = require("../controllers/turfController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addTurf);
router.get("/", getAllTurfs);

module.exports = router;