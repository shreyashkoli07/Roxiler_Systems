require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/owner', require('./routes/owner')); // Owner specific routes

// Health Check
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "API is running 😊" });
});

// Start Server
const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false }); // use { force: true } only in dev
      console.log("Models synced successfully");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log("⚡ Closing server...");
      await sequelize.close();
      server.close(() => {
        console.log("Server and DB connections closed");
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (err) {
    console.error(" DB connection failed:", err.message);
    console.error(err);
    process.exit(1); // Exit app if DB fails
  }
};

startServer();
