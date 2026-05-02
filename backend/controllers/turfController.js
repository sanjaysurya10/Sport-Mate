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
      unavailableDates: [],
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

const addUnavailableDate = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    if (turf.unavailableDates.includes(date)) {
      return res.status(400).json({ message: "This date is already marked as closed" });
    }

    turf.unavailableDates.push(date);
    await turf.save();

    return res.status(200).json({
      message: "Closed date added successfully",
      turf,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeUnavailableDate = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    turf.unavailableDates = turf.unavailableDates.filter(
      (closedDate) => closedDate !== date
    );

    await turf.save();

    return res.status(200).json({
      message: "Closed date removed successfully",
      turf,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTurf,
  getAllTurfs,
  addUnavailableDate,
  removeUnavailableDate,
};