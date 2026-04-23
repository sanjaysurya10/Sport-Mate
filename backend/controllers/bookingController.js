const Booking = require("../models/Booking");
const User = require("../models/user");
const Turf = require("../models/Turf");
const sendEmail = require("../utils/sendEmail");

const createBooking = async (req, res) => {
  try {
    const { turfId, bookingDate, timeSlot } = req.body;
    const userId = req.user.id;

    if (!turfId || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingBooking = await Booking.findOne({
      turfId,
      bookingDate,
      timeSlot,
      status: "booked",
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const booking = await Booking.create({
      userId,
      turfId,
      bookingDate,
      timeSlot,
    });

    const user = await User.findById(userId);
    const turf = await Turf.findById(turfId);

    if (user && turf) {
      await sendEmail(
        user.email,
        "SportMate Booking Confirmation",
        `Hello ${user.name},

Your booking has been confirmed.

Turf: ${turf.name}
Location: ${turf.location}
Date: ${bookingDate}
Time: ${timeSlot}

Thank you for using SportMate.`
      );
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    const user = await User.findById(booking.userId);
    const turf = await Turf.findById(booking.turfId);

    if (user && turf) {
      await sendEmail(
        user.email,
        "SportMate Booking Cancelled",
        `Hello ${user.name},

Your booking has been cancelled.

Turf: ${turf.name}
Location: ${turf.location}
Date: ${booking.bookingDate}
Time: ${booking.timeSlot}

We hope to see you again soon on SportMate.`
      );
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email role")
      .populate("turfId", "name location sportType pricePerHour");

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, cancelBooking, getAllBookings };