const { raw } = require("body-parser");
const {
  sequelize2,
  sequelize3,
  sequelize4,
  sequelize5,
} = require("../../config/connectDB");
const db = require("../../models/index");
const { getOneQuestion } = require("../../services/question.service");

module.exports.executeQueryTest = async () => {
  try {
    await sequelize2.query(
      "create temporary table temp_table as select * from javasql2.sinhvien"
    );
    let [results, metadata] = await sequelize2.query(
      "select * from temp_table"
    );
    await sequelize2.query(
      "delete from javasql2.temp_table where MaSinhVien = 1"
    );
    [results, metadata] = await sequelize2.query(
      "select * from javasql2.temp_table"
    );
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

module.exports.executeUserQuery = async (
  query,
  schema,
  question,
  answerSql
) => {
  let type = question.TheLoai;
  let table = answerSql.BangMucTieu;
  try {
    // await sequelize2.query("CREATE TEMPORARY TABLE temp_table LIKE user");
    // await sequelize2.query("INSERT INTO temp_table SELECT * FROM user;");
    const valid = await validateQuery(query.chitiet);
    if (!valid) {
      return [];
    }

    await sequelize2.query("USE " + schema);
    let [results, metadata] = [];
    console.log(type);
    switch (type) {
      case "select":
        [results, metadata] = await sequelize2.query(query.chitiet);
        break;
      case "delete":
        await sequelize2.query(
          `DROP TEMPORARY TABLE IF EXISTS ${table}_tmp;` // Xóa bảng tạm nếu đã tồn tại
        );
        await sequelize2.query(
          `CREATE TEMPORARY TABLE ${table}_tmp AS SELECT * FROM ` + table
        );
        const newQueryDelete = await replaceTableName(query.chitiet, table);
        await sequelize2.query(newQueryDelete);
        [results, metadata] = await sequelize2.query(
          `select * from ${table}_tmp`
        );
        await sequelize2.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
        break;
      case "update":
        await sequelize2.query(
          `DROP TEMPORARY TABLE IF EXISTS ${table}_tmp;` // Xóa bảng tạm nếu đã tồn tại
        );
        await sequelize2.query(
          `CREATE TEMPORARY TABLE ${table}_tmp AS SELECT * FROM ` + table
        );
        const newQueryUpdate = replaceTableName(query.chitiet, table);
        await sequelize2.query(newQueryUpdate);
        [results, metadata] = await sequelize2.query(
          `select * from ${table}_tmp`
        );
        await sequelize2.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
        break;
      case "create":
        await sequelize2.query(query.chitiet);
        [results, metadata] = await sequelize2.query(`
          SELECT 
            TABLE_NAME, 
            COLUMN_NAME, 
            CONSTRAINT_NAME, 
            REFERENCED_TABLE_NAME, 
            REFERENCED_COLUMN_NAME
          FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE 
            TABLE_NAME = ${table} AND 
            TABLE_SCHEMA = ${schema};
        `);
        await sequelize2.query(`DROP TEMPORARY TABLE IF EXISTS ${table}`);
        break;
      default:
        break;
    }
    // console.log(results);
    return results;
  } catch (error) {
    await sequelize2.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
    // console.log(error);
    return null;
  }
};

//phải tạo ra bảng mới tương tự bảng mục tiêu nhưng là đã sửa đổi,
// sau đó chỉ việc select từ đó ra để so sánh
module.exports.getAnswerSql = async (query, schema, question, answerSql) => {
  try {
    await sequelize3.query("USE " + schema);
    let [results, metadata] = await sequelize3.query(
      "select * from " + answerSql.ChiTiet
    );
    return results;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

module.exports.executeUserQueryInTc = async (
  query,
  schema,
  question,
  answerSql
) => {
  let type = question.TheLoai;
  let table = answerSql.BangMucTieu;
  try {
    // await sequelize2.query("CREATE TEMPORARY TABLE temp_table LIKE user");
    // await sequelize2.query("INSERT INTO temp_table SELECT * FROM user;");
    const valid = await validateQuery(query.chitiet);
    if (!valid) {
      return [];
    }

    await sequelize3.query("USE " + schema);
    let [results, metadata] = [];
    console.log(query);
    console.log(type);

    switch (type) {
      case "select":
        [results, metadata] = await sequelize3.query(query.chitiet);
        break;
      case "delete":
        await sequelize3.query(
          `DROP TEMPORARY TABLE IF EXISTS ${table}_tmp;` // Xóa bảng tạm nếu đã tồn tại
        );
        await sequelize3.query(
          `CREATE TEMPORARY TABLE ${table}_tmp AS SELECT * FROM ` + table
        );
        const newQueryDelete = await replaceTableName(query.chitiet, table);
        console.log("hiep: ", newQueryDelete);
        await sequelize3.query(newQueryDelete);
        [results, metadata] = await sequelize3.query(
          `select * from ${table}_tmp`
        );
        await sequelize3.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
        break;
      case "update":
        await sequelize3.query(
          `DROP TEMPORARY TABLE IF EXISTS ${table}_tmp;` // Xóa bảng tạm nếu đã tồn tại
        );
        await sequelize3.query(
          `CREATE TEMPORARY TABLE ${table}_tmp AS SELECT * FROM ` + table
        );
        const newQueryUpdate = replaceTableName(query.chitiet, table);
        await sequelize3.query(newQueryUpdate);
        [results, metadata] = await sequelize3.query(
          `select * from ${table}_tmp`
        );
        await sequelize3.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
        break;
      case "create":
        await sequelize3.query(query.chitiet);
        [results, metadata] = await sequelize3.query(`
          SELECT 
            TABLE_NAME, 
            COLUMN_NAME, 
            CONSTRAINT_NAME, 
            REFERENCED_TABLE_NAME, 
            REFERENCED_COLUMN_NAME
          FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE 
            TABLE_NAME = ${table} AND 
            TABLE_SCHEMA = ${schema};
        `);
        await sequelize3.query(`DROP TEMPORARY TABLE IF EXISTS ${table}`);
        break;
      default:
        break;
    }
    // console.log(results);
    return results;
  } catch (error) {
    await sequelize3.query(`DROP TEMPORARY TABLE IF EXISTS ${table}_tmp`);
    console.log(error);
    return null;
  }
};

const replaceTableName = async (query, tableDes) => {
  if (query.includes(tableDes)) {
    return query.replaceAll(tableDes, tableDes + "_tmp");
  }
  return query;
};

const removeCommentsAndTrim = async (query) => {
  // Loại bỏ tất cả các comment đơn dòng (--...) và comment nhiều dòng (/* ... */)
  let cleanedQuery = query
    .replace(/--.*$/gm, "") // Loại bỏ comment đơn dòng
    .replace(/\/\*[\s\S]*?\*\//g, ""); // Loại bỏ comment nhiều dòng

  // Loại bỏ các dấu cách, tab, và xuống dòng ở đầu câu lệnh
  cleanedQuery = cleanedQuery.replace(/^[\s\r\n]+/, "");

  return cleanedQuery;
};

const validateQuery = async (query) => {
  // Loại bỏ các comment và dấu trắng ở đầu câu truy vấn
  let cleanedQuery = await removeCommentsAndTrim(query);
  cleanedQuery = cleanedQuery.toLowerCase();
  // Kiểm tra các câu truy vấn SELECT, INSERT, UPDATE, DELETE
  const denyQueries = ["show", "temporary", "information_schema"];

  // Kiểm tra xem câu truy vấn đã được làm sạch có bắt đầu với từ khóa hợp lệ
  for (const keyword of denyQueries) {
    if (cleanedQuery.includes(keyword)) {
      return false; // Nếu bắt đầu với từ khóa hợp lệ, chấp nhận
    }
  }

  return true; // Nếu không phải lệnh hợp lệ, từ chối
};
