// Backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS Blocked: Origin Not Allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Preflight requests
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

// ------------------ Routes ------------------
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/stores', require('./src/routes/stores'));
app.use('/api/ratings', require('./src/routes/ratings'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/user', require('./src/routes/user'));
app.use('/api/owner', require('./src/routes/owner'));


// Health check
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "API is running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;
