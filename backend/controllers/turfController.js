const Turf = require("../models/Turf");

const addTurf = async (req, res) => {
  try {
    const { name, location, sportType, pricePerHour, facilities, ownerId } = req.body;

    if (!name || !location || !sportType || !pricePerHour || !ownerId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const turf = await Turf.create({
      name,
      location,
      sportType,
      pricePerHour,
      facilities,
      ownerId,
    });

    return res.status(201).json({
      message: "Turf added successfully",
      turf,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().populate("ownerId", "name email role");
    return res.status(200).json(turfs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addTurf, getAllTurfs };