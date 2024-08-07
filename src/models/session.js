const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SessionUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // //console.log(models.Test)
    }
  }
  SessionUser.init(
    {
      MSV: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      AccessToken: DataTypes.STRING,
      LastActivity: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "SessionUser",
      tableName: "phiendangnhap",
      timestamps: false,
    }
  );

  SessionUser.removeAttribute("id");
  return SessionUser;
};
