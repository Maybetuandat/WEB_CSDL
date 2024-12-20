const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schema extends Model {
    static associate(models) {}
  }
  Schema.init(
    {
      MaSchema: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TenSchema: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // options
      sequelize,
      modelName: "Schema",
      tableName: "existing_schemas",
      timestamps: false,
    }
  );

  Schema.removeAttribute("id");
  return Schema;
};
