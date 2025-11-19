require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// ------------------ CORS CONFIG ------------------
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // server-to-server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS Blocked: Origin Not Allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// ------------------ Middlewares ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Routes ------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/owner', require('./routes/owner'));

// ------------------ Health Check ------------------
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "API is running 😊" });
});

// ------------------ Global Error Handler ------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false }); // force: true only in dev if needed
      console.log("Models synced successfully");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ------------------ Graceful Shutdown ------------------
    const gracefulShutdown = async () => {
      console.log("⚡ Closing server and database...");
      await sequelize.close();
      server.close(() => {
        console.log("Server and DB connections closed");
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // Stop app if DB fails
  }
};

startServer();
