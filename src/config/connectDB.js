const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000, // Thời gian chờ kết nối đến MySQL, tính bằng ms
    },
  }
);
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database ${process.env.DB_NAME} connect successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const sequelize2 = new Sequelize(
  process.env.DB_NAME2,
  process.env.DB_USER2,
  process.env.DB_PASSWORD2,
  {
    host: "localhost",
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000, // Thời gian chờ kết nối đến MySQL, tính bằng ms
    },
  }
);
const connection2 = async () => {
  try {
    await sequelize2.authenticate();
    console.log(`Database ${process.env.DB_NAME2} connect successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connection, sequelize, connection2, sequelize2 };
