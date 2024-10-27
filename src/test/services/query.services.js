const { raw } = require("body-parser");
const { sequelize2 } = require("../../config/connectDB");
const db = require("../../models/index");

module.exports.executeQueryTest = async () => {
  try {
    await sequelize2.query(
      "create temporary table temp_table as select * from user"
    );
    let [results, metadata] = await sequelize2.query(
      "select * from temp_table"
    );
    await sequelize2.query("delete from temp_table where id = 1");
    [results, metadata] = await sequelize2.query("select * from temp_table");
    console.log(results); // Chỉ in ra kết quả truy vấn (dữ liệu)

    return results;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    console.log("hehe");
    sequelize2.close();
  }
};

module.exports.executeUserQuery = async (query) => {
  try {
    // await sequelize2.query("CREATE TEMPORARY TABLE temp_table LIKE user");
    // await sequelize2.query("INSERT INTO temp_table SELECT * FROM user;");
    let [results, metadata] = await sequelize2.query(query);
    // let [results2, metadata2] = await sequelize2.query(
    //   "select * from temp_table limit 1"
    // );
    // if (JSON.stringify(results) === JSON.stringify(results2)) {
    //   console.log("true");
    // } else {
    //   console.log("false");
    // }
    // await sequelize2.query("drop table temp_table");

    return results;
  } catch (error) {
    // await sequelize2.query("drop table temp_table");
    console.log(error);
    return null;
  }
};

module.exports.getAnswerSql = async (mbt, cau) => {
  try {
    let queryRight = await db.AnswerSql.findOne({
      where: {
        MaBaiThi: mbt,
        Cau: cau,
      },
      raw: true,
    });
    let [results, metadata] = await sequelize2.query(queryRight.ChiTiet);
    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
};
