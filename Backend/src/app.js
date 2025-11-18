require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Database
const { sequelize } = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/owner', require('./routes/owner'));  // Owner specific routes

// Health Check
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "API is running 😊" });
});

// Start Server
const port = process.env.PORT || 5000;

(async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync(); 
    console.log("Models synced successfully!");

    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // Exit app if DB fails
  }
})();
