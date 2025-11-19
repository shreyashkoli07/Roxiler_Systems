const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Check required env variables
['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST'].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠ Warning: ${key} is not set in environment variables`);
  }
});

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    define: {
      underscored: true,
      timestamps: true,
      freezeTableName: true
    },

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    dialectOptions: process.env.DB_SSL === "true" 
      ? { ssl: { require: true, rejectUnauthorized: false } } 
      : {},

    retry: {
      max: 3
    }
  }
);

// Object to hold all models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load all models in this directory except index.js
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false }); // use { force: true } only in dev
      console.log('Models synced with the database');
    }
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1); // stop server if DB connection fails
  }
};

connectDB();

// Graceful shutdown
const closeDB = async () => {
  try {
    console.log('Closing DB connection...');
    await sequelize.close();
    console.log('DB connection closed');
  } catch (err) {
    console.error('Error closing DB connection:', err);
  }
  process.exit(0);
};

process.on('SIGINT', closeDB);
process.on('SIGTERM', closeDB);

module.exports = db;
