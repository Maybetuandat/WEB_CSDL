const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Detail.hasOne(models.Test, {
      //   foreignKey: "MaBaiThi",
      //   targetKey: "MaBaiThi",
      // });
      Detail.hasOne(models.Result, {
        foreignKey: "MaKetQua",
        targetKey: "MaKetQua",
      });
      Detail.belongsTo(models.Question, {
        foreignKey: "MaCauHoi",
        targetKey: "MaCauHoi",
        as: "QuestionByMaCauHoi", // Đặt alias cho quan hệ
      });

      // Detail.belongsTo(models.Question, {
      //   foreignKey: "MaBaiThi",
      //   targetKey: "MaBaiThi",
      //   as: "QuestionByMaBaiThi", // Đặt alias cho quan hệ
      // });
      Detail.hasOne(models.Option, {
        foreignKey: "MaLuaChon",
        targetKey: "MaLuaChon",
      });
    }
  }
  Detail.init(
    {
      MaChiTiet: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      MaKetQua: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      MaBaiThi: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      MaCauHoi: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      MaLuaChon: {
        type: DataTypes.STRING,
      },
      Dung: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      // options
      sequelize,
      modelName: "Detail",
      tableName: "ketquatungcau",
      timestamps: false,
    }
  );

  Detail.removeAttribute("id");
  return Detail;
};
