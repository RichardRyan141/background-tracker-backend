import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js";

const app = express();
app.use(bodyParser.json());

// Simple route to test
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API to receive location data
app.post("/location", async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;

  if (!latitude || !longitude || !timestamp) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await pool.query(
      "INSERT INTO locations (uid, latitude, longtitude, timestamp) VALUES (1, $1, $2, to_timestamp($3 / 1000.0))",
      [latitude, longitude, timestamp]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).send("Database error");
  }
});

app.get("/locations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT uid, latitude, longtitude, timestamp FROM locations ORDER BY id DESC LIMIT 500"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
