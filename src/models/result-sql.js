const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultSql extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // //// console.log(models.Test)
      //   Result.hasOne(models.Test, {
      //     foreignKey: "MaBaiThi",
      //     targetKey: "MaBaiThi",
      //   });
      ResultSql.belongsTo(models.Student, { foreignKey: "MSV" });
    }
  }
  ResultSql.init(
    {
      MaKetQua: {
        type: DataTypes.INTEGER, // hoặc BIGINT tùy thuộc vào kiểu dữ liệu bạn muốn sử dụng
        primaryKey: true,
        autoIncrement: true,
      },
      MSV: DataTypes.STRING,
      MaBaiThi: DataTypes.STRING,
      Cau: DataTypes.INTEGER,
      ThoiGianNopBai: DataTypes.DATE,
      ChiTiet: DataTypes.STRING,
    },
    {
      // options
      sequelize,
      modelName: "ResultSql",
      tableName: "ketquasql",
      timestamps: false,
    }
  );

  ResultSql.removeAttribute("id");
  return ResultSql;
};
