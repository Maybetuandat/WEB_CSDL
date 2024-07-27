const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {

        static associate(models) {
        }
    }
    Comment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            content: DataTypes.STRING,
            MaSinhVien: DataTypes.STRING,
            MaBaiThi:DataTypes.INTEGER,
            binhLuanCha:DataTypes.INTEGER,
            thoiGianTao: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },

        },
        {
            // options
            sequelize,
            modelName: "Comment",
            tableName: "comment",
            timestamps: false,
        }
    );

    Comment.removeAttribute("id");
    return Comment;
};
