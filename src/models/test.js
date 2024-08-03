const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.hasMany(models.Question, { foreignKey: "MaBaiThi" });
      Test.hasMany(models.Result, { foreignKey: "MaBaiThi" });
      Test.hasMany(models.Shift, { foreignKey: "MaBaiThi" });
      Test.belongsTo(models.Student, {
        foreignKey: "TacGia",
        targetKey: "MSV",
      });
    }
  }
  Test.init(
    {
      MaBaiThi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TenBaithi: DataTypes.STRING,
      ThoiGianBatDau: DataTypes.STRING,
      ThoiGianThi: DataTypes.INTEGER,
      SoLuongCau: DataTypes.INTEGER,
      TheLoai: DataTypes.STRING,
      TrangThai: DataTypes.STRING,
      img_url: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      TacGia: {
        type: DataTypes.STRING,
      },
    },
    {
      // options
      sequelize,
      modelName: "Test",
      tableName: "baithi",
      timestamps: false,
    }
  );
  Test.removeAttribute("id");

  return Test;
};
