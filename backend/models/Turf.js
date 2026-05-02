const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    sportType: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    facilities: {
      type: [String],
      default: [],
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    unavailableDates: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Turf", turfSchema);