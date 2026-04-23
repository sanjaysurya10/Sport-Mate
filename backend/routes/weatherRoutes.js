const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key missing" });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || "Failed to fetch weather data",
      });
    }

    return res.status(200).json({
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching weather" });
  }
});

module.exports = router;