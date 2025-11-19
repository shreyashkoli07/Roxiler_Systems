// Backend/index.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;


const modelsDir = path.join(__dirname, "src", "models");

if (!fs.existsSync(modelsDir)) {
  console.error("Models folder not found:", modelsDir);
  process.exit(1);
}

fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;
