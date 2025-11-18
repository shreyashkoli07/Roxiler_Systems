require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

const app = express();


// CORS CONFIG

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {

      //server-to-server or tools with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS Blocked: Origin Not Allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});


// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts.",
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);


// Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stores", require("./routes/stores"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/owner", require("./routes/owner"));

app.get("/", (req, res) =>
  res.json({ status: "OK", message: "API running" })
);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


// Start Server
const port = process.env.PORT || 5000;

(async () => {
  try {
    console.log("Connecting to DB...");
    await sequelize.authenticate();
    console.log("DB connected!");

    await sequelize.sync({ alter: false });
    console.log("Models synced!");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
})();
