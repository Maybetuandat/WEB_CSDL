const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // //console.log(models.Test)
      //   Result.hasOne(models.Test, {
      //     foreignKey: "MaBaiThi",
      //     targetKey: "MaBaiThi",
      //   });
      ResultTest.belongsTo(models.Student, { foreignKey: "MSV" });
    }
  }
  ResultTest.init(
    {
      MaKetQua: {
        type: DataTypes.INTEGER, // hoặc BIGINT tùy thuộc vào kiểu dữ liệu bạn muốn sử dụng
        primaryKey: true,
        autoIncrement: true,
      },
      MSV: DataTypes.STRING,
      MaBaiThi: DataTypes.STRING,
      Diem: DataTypes.FLOAT,
      ThoiGianLamBai: DataTypes.DATE,
      ThoiGianNopBai: DataTypes.DATE,
      ChiTiet: DataTypes.STRING,
      DanhSachCau: DataTypes.STRING,
    },
    {
      // options
      sequelize,
      modelName: "ResultTest",
      tableName: "ketquathi",
      timestamps: false,
    }
  );

  ResultTest.removeAttribute("id");
  return ResultTest;
};
