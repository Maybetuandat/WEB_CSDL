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

module.exports = { connection, sequelize };
