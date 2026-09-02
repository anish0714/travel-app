const express = require("express");
const cors = require("cors");

const airportsRouter = require("./routes/airports");
const airlinesRouter = require("./routes/airlines");
const hotelsRouter = require("./routes/hotels");
const flightsRouter = require("./routes/flights");
const bookingsRouter = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "travel-app-backend",
    endpoints: ["/health", "/airports", "/airlines", "/hotels", "/hotels/:id", "/flights", "/bookings", "/bookings/:id"],
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/airports", airportsRouter);
app.use("/airlines", airlinesRouter);
app.use("/hotels", hotelsRouter);
app.use("/flights", flightsRouter);
app.use("/bookings", bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

module.exports = app;
