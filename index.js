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
  const { latitude, longtitude, timestamp } = req.body;

  if (!latitude || !longtitude || !timestamp) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await pool.query(
      "INSERT INTO loc_3 (uid, latitude, longtitude, timestamp) VALUES (1, $1, $2, $3)",
      [latitude, longtitude, timestamp]
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
    const formatted = result.rows.map((row) => ({
      ...row,
      timestamp: new Date(parseInt(row.timestamp)).toISOString(), 
      // or: Number(row.timestamp) if you prefer numeric timestamps
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
