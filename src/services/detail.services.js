const { raw } = require("mysql2");
const db = require("../models/index");
const { where, Op } = require("sequelize");
const { default: Transaction } = require("sequelize/lib/transaction");
const { sequelize, connection } = require("../config/connectDB"); // Update the path accordingly

const getDetailListWithIdResult = async (idResult) => {
  try {
    // Establish connection
    await connection();
    const data = { _option: null, _detail: null };
    const detail = await sequelize.query(
      `
      SELECT 
        Detail.MaChiTiet,
        Detail.MaKetQua,
        Detail.MaBaiThi,
        Detail.MaCauHoi,
        Detail.MaLuaChon,
        Detail.Dung,
        Question.MaCauHoi,
        Question.MaBaiThi,
        Question.DeBai,
        Question.SoThuTu,
        Question.TheLoai
      FROM 
        ketquatungcau AS Detail
      INNER JOIN 
        cauhoi AS Question 
      ON 
        Detail.MaCauHoi = Question.MaCauHoi 
        AND Detail.MaBaiThi = Question.MaBaiThi
      WHERE 
        Detail.MaKetQua = :idResult`,
      {
        replacements: { idResult },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    data._detail = detail;
    let maCauHois = detail.map((d) => d.MaCauHoi); // Lấy mảng MaCauHoi từ detail

    const optionsData = await sequelize.query(
      `
      SELECT
          NoiDung,
          Dung,
          MaLuaChon,
          MaBaiThi,
          MaCauHoi 
      FROM
          luachon 
      WHERE
          MaBaiThi = :maBaiThi 
          AND MaCauHoi IN (:maCauHois);  `,
      {
        replacements: {
          maBaiThi: detail[0].MaBaiThi, // Giả sử tất cả đều có MaBaiThi giống nhau
          maCauHois: maCauHois,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    let option = [];
    for (let i = 0; i < optionsData.length; i += 4) {
      const optionGroup = {
        MaBaiThi: optionsData[i].MaBaiThi,
        MaCauHoi: optionsData[i].MaCauHoi,
        Options: [],
      };

      for (let j = 0; j < 4; j++) {
        if (optionsData[i + j]) {
          optionGroup.Options.push({
            NoiDung: optionsData[i + j].NoiDung,
            Dung: optionsData[i + j].Dung,
            MaLuaChon: optionsData[i + j].MaLuaChon,
          });
        }
      }

      option.push(optionGroup);
    }
    data._option = option;
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
};

const getDetailListWithIdResultandIdStu = async (mkq, msv) => {
  try {
    let result = await db.Result.findAll({
      where: {
        MaKetQua: mkq,
        MSV: msv,
      },
      raw: true,
    });
    if (result) {
      let details = await db.Detail.findAll({
        where: {
          MaKetQua: mkq,
        },
        raw: true,
      });
      let allQuestions = await db.Question.findAll({
        raw: true,
      });
      for (let detail of details) {
        let filterQuestions = await allQuestions.filter(
          (question) =>
            detail.MaBaiThi === question.MaBaiThi &&
            detail.MaCauHoi === question.MaCauHoi
        );

        detail.DeBai = filterQuestions.map((question) => {
          const { MaBaiThi, MaCauHoi, ...rest } = question;
          return rest;
        });
      }
      let allOptions = await db.Option.findAll({
        raw: true,
      });
      for (let detail of details) {
        let filterOptions = await allOptions.filter(
          (option) =>
            detail.MaBaiThi === option.MaBaiThi &&
            detail.MaCauHoi === option.MaCauHoi
        );

        detail.LuaChon = filterOptions.map((option) => {
          const { MaBaiThi, MaCauHoi, ...rest } = option;
          return rest;
        });
      }

      return details;
    } else return null;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return null;
  }
};

// const createNewDetail = async (question, maketqua, mabaithi, index, dung, t) => {
//   try {
//     await db.Detail.create(
//       {
//         MaChiTiet: 'CT' + String(index).padStart(2, '0'),
//         MaKetQua: maketqua,
//         MaBaiThi: mabaithi,
//         MaCauHoi: question.macauhoi,
//         MaLuaChon: question.maluachon,
//         Dung: dung
//       },
//       { transaction: t }
//     )
//   }
//   catch (error) {
//     t.rollback()
//   }
// }

const createNewDetail = async (questionList, result, test, diem, t) => {
  const details = [];

  for (let i = 0; i < questionList.length; i++) {
    if (questionList[i].maluachon != "E") {
      details.push({
        MaChiTiet: "CT" + String(i + 1).padStart(2, "0"),
        MaKetQua: result.dataValues.MaKetQua,
        MaBaiThi: test.mabaithi,
        MaCauHoi: questionList[i].macauhoi,
        MaLuaChon: questionList[i].maluachon,
        Dung: diem[i],
      });
    }
  }

  try {
    await db.Detail.bulkCreate(details, { transaction: t });
  } catch (error) {
    await t.rollback();
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

module.exports = {
  getDetailListWithIdResult,
  getDetailListWithIdResultandIdStu,
  createNewDetail,
};
