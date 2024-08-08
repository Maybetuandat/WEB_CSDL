const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ListStudent.belongsTo(models.Student, { foreignKey: "MSV" });
      ListStudent.belongsTo(models.Shift, { foreignKey: "MaCaThi" });
    }
  }
  ListStudent.init(
    {
      MSV: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      MaCaThi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      // options
      sequelize,
      modelName: "ListStudent",
      tableName: "danhsachthi",
      timestamps: false,
    }
  );

  ListStudent.removeAttribute("id");
  return ListStudent;
};
