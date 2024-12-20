const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Test, { foreignKey: "MaBaiThi" });
      Question.hasMany(models.Option, {
        foreignKey: "MaCauHoi",
        targetKey: "MaCauHoi",
        as: "LuaChon",
      });
      Question.hasMany(models.Detail, {
        foreignKey: "MaCauHoi",
      });
      Question.hasMany(models.Detail, {
        foreignKey: "MaBaiThi",
      });
    }
  }
  Question.init(
    {
      MaCauHoi: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      MaBaiThi: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      DeBai: DataTypes.STRING,
      SoThuTu: DataTypes.INTEGER,
      TheLoai: DataTypes.STRING,
      HinhAnh: DataTypes.STRING,
    },
    {
      // options
      sequelize,
      modelName: "Question",
      tableName: "cauhoi",
      timestamps: false,
    }
  );

  Question.removeAttribute("id");
  return Question;
};
