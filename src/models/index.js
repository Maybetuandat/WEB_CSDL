"use javasql";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    pool: {
      max: 50, // Số lượng kết nối tối đa là 50
      min: 5, // Số lượng kết nối tối thiểu
      acquire: 60000, // Thời gian tối đa (ms) để lấy một kết nối trước khi bỏ cuộc (50 giây)
      idle: 10000, // Thời gian tối đa (ms) để một kết nối có thể nhàn rỗi trước khi bị đóng
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    pool: {
      max: 50, // Số lượng kết nối tối đa là 50
      min: 5, // Số lượng kết nối tối thiểu
      acquire: 60000, // Thời gian tối đa (ms) để lấy một kết nối trước khi bỏ cuộc (50 giây)
      idle: 10000, // Thời gian tối đa (ms) để một kết nối có thể nhàn rỗi trước khi bị đóng
    },
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
