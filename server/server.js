import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const PORT = 5000;
const API_KEY = process.env.API_KEY;

app.get("/weather", async (req, res) => {
  const { city, unit } = req.query;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
