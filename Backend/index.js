const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: { underscored: true, timestamps: true, freezeTableName: true },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: process.env.DB_SSL === "true"
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
    retry: { max: 3 }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

// Test DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false });
      console.log("Models synced successfully");
    }
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1); // Exit if DB fails
  }
})();

// Graceful shutdown
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log("DB connection closed");
  } catch (err) {
    console.error("Error closing DB connection:", err);
  }
  process.exit(0);
};
process.on('SIGINT', closeDB);
process.on('SIGTERM', closeDB);

module.exports = db;
