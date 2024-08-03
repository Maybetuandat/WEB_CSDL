const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Shift.belongsTo(models.Test, {
        foreignKey: "MaBaiThi",
        targetKey: "MaBaiThi",
      });
    }
  }
  Shift.init(
    {
      MaCaThi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaBaiThi: {
        type: DataTypes.INTEGER,
      },
      start: DataTypes.DATE,
      end: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "Shift",
      tableName: "cathi",
      timestamps: false,
    }
  );
  Shift.removeAttribute("id");

  return Shift;
};
