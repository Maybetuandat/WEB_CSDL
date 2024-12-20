const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnswerSql extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AnswerSql.init(
    {
      MaBaiThi: {
        type: DataTypes.INTEGER, // hoặc BIGINT tùy thuộc vào kiểu dữ liệu bạn muốn sử dụng
        primaryKey: true,
      },
      Cau: {
        type: DataTypes.INTEGER, // hoặc BIGINT tùy thuộc vào kiểu dữ liệu bạn muốn sử dụng
        primaryKey: true,
      },
      ChiTiet: DataTypes.STRING,
      BangMucTieu: DataTypes.STRING,
    },
    {
      // options
      sequelize,
      modelName: "AnswerSql",
      tableName: "dapansql",
      timestamps: false,
    }
  );

  AnswerSql.removeAttribute("id");
  return AnswerSql;
};
