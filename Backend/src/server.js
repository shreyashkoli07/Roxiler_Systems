// Backend/server.js
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./index');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false });
      console.log("Models synced successfully");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
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
    console.error(err);
    // Throw error without exiting immediately (Render will log it)
    throw err;
  }
};

startServer();
