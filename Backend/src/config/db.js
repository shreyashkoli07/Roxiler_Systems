const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure required env variables are set
const requiredEnv = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables`);
  }
});

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

// Database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false }); // change to { force: true } only for dev
      console.log('Models synced with the database');
    }
  } catch (error) {
    console.error('DB Connection Error:', error.message);
    console.error(error);
    process.exit(1); // stop the process if DB connection fails
  }
};

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

connectDB();

module.exports = sequelize;
