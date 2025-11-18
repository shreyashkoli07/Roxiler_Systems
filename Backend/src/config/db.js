const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
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

    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false
    },

    retry: {
      max: 3
    }
  }
);

//Database Connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: false });
      console.log('Models synced with the database');
    }
  } catch (error) {
    console.error('DB Connection Error:', error.message);
    console.error('Full Error:', error);
  }
};

// Shutdown
process.on('SIGINT', async () => {
  console.log('Closing DB connection...');
  await sequelize.close();
  console.log('DB connection closed');
  process.exit(0);
});

connectDB();

module.exports = sequelize;
