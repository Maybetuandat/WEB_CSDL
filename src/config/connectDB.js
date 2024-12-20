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

// Hàm khởi tạo đối tượng Sequelize
const createSequelizeInstance = (
  dbNameEnv,
  dbUserEnv,
  dbPasswordEnv,
  dbPortEnv
) => {
  if (
    !process.env[dbNameEnv] ||
    !process.env[dbUserEnv] ||
    !process.env[dbPasswordEnv]
  ) {
    console.error(`Missing environment variables for ${dbNameEnv}`);
    return null;
  }

  return new Sequelize(
    process.env[dbNameEnv],
    process.env[dbUserEnv],
    process.env[dbPasswordEnv],
    {
      host: "localhost",
      port: process.env[dbPortEnv] || 3306,
      dialect: "mysql",
      dialectOptions: { connectTimeout: 60000 },
      pool: {
        max: 20,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
};

// Hàm xác thực kết nối
const authenticateDatabase = async (sequelize, dbName) => {
  if (!sequelize) return;
  try {
    await sequelize.authenticate();
    console.log(`Database ${dbName} connected successfully.`);
  } catch (error) {
    console.error(`Unable to connect to database ${dbName}:`, error);
  }
};

// Tạo các kết nối cơ sở dữ liệu
const sequelize2 = createSequelizeInstance(
  "DB_NAME2",
  "DB_USER2",
  "DB_PASSWORD2",
  "DB_PORT"
);
const sequelize3 = createSequelizeInstance(
  "DB_NAME3",
  "DB_USER3",
  "DB_PASSWORD3",
  "DB_PORT"
);
const sequelize4 = createSequelizeInstance(
  "DB_NAME4",
  "DB_USER4",
  "DB_PASSWORD4",
  "DB_PORT"
);
const sequelize5 = createSequelizeInstance(
  "DB_NAME5",
  "DB_USER5",
  "DB_PASSWORD5",
  "DB_PORT"
);

// Xác thực kết nối
authenticateDatabase(sequelize2, process.env.DB_NAME2);
authenticateDatabase(sequelize3, process.env.DB_NAME3);
authenticateDatabase(sequelize4, process.env.DB_NAME4);
authenticateDatabase(sequelize5, process.env.DB_NAME5);

module.exports = {
  connection,
  sequelize,
  // connection2,
  // sequelize2,
  // connection3,
  // sequelize3,
  // connection4,
  // sequelize4,
  // connection5,
  // sequelize5,
};
