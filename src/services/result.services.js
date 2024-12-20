const { default: Transaction } = require("sequelize/lib/transaction");
const db = require("../models/index");
const { sequelize } = require("../config/connectDB");
const { Op } = require("sequelize");
const { createNewDetail } = require("./detail.services");

const getResultByIdStuAndIdTest = async (idStu, idTest) => {
  const data = {
    status: null,
    data: null,
  };
  try {
    const res = await db.Result.findAll({
      raw: true,
      where: {
        MSV: idStu,
        MaBaiThi: idTest,
      },
    });
    if (res) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
    }
    return data;
  } catch (e) {
    data.status = 500;
    return data;
  }
};
const getResultThiByIdStuAndIdTest = async (idStu, idTest) => {
  const data = {
    status: null,
    data: null,
  };
  try {
    const res = await db.ResultTest.findAll({
      raw: true,
      where: {
        MSV: idStu,
        MaBaiThi: idTest,
      },
    });
    let matches = res[0].DanhSachCau.match(/C\d{2}/g);
    let numbers = matches.map((match) => parseInt(match.slice(1), 10));
    let anstmpArray = new Array(numbers.length).fill("E"); // Tạo mảng toàn chữ 'E'
    for (let i = 0; i < numbers.length; i++) {
      anstmpArray[numbers[i] - 1] = res[0].ChiTiet[i]; // Thay đổi giá trị tại chỉ số tương ứng
    }
    let anstmp = anstmpArray.join(""); // Chuyển mảng thành chuỗi
    res[0].ChiTiet = anstmp;
    if (res) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
    }
    return data;
  } catch (e) {
    data.status = 500;
    return data;
  }
};
const getResultByIdTest = async (idTest) => {
  const data = {
    status: null,
    data: null,
  };
  try {
    const res = await db.Result.findAll({
      raw: true,
      where: {
        MaBaiThi: idTest,
      },
    });
    if (res) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
    }
    return data;
  } catch (e) {
    data.status = 500;
    return data;
  }
};

const getResultByIdThi = async (idTest, theloai) => {
  const data = {
    status: null,
    data: null,
  };
  try {
    let res = [];
    if (theloai != "sql" && theloai != "tự luận") {
      res = await db.ResultTest.findAll({
        raw: true,
        where: {
          MaBaiThi: idTest,
        },
      });
    } else {
      res = await db.ResultSql.findAll({
        raw: true,
        attributes: [
          "MSV", // Lấy trường MSV
          [db.sequelize.fn("COUNT", db.sequelize.col("MSV")), "count"], // Đếm số lượng MSV
          [
            db.sequelize.literal("SUM(CASE WHEN Dung = 1 THEN 1 ELSE 0 END)"),
            "Diem", // Đếm số lượng Dung = 1
          ],
        ],
        where: {
          MaBaiThi: idTest, // Điều kiện lọc theo MaBaiThi
        },
        group: ["MSV"], // Nhóm theo MSV
      });
    }
    if (res) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
    }
    return data;
  } catch (e) {
    data.status = 500;
    return data;
  }
};

const getAllResult = async (req, res) => {
  const data = {
    status: null,
    data: null,
  };
  try {
    const res = await db.Result.findAll();
    if (res.length > 0) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
    }
    return data;
  } catch (e) {
    data.status = 500;
    return data;
  }
};

const getResultWithIdResult = async (idResult) => {
  const data = {
    status: null,
    data: null,
  };

  try {
    const res = await db.Result.findAll({
      raw: true,
      where: {
        MaBaiThi: idResult,
      },
    });
    //neu ton tai -> 200
    // khong ton tai -> 400
    //truy van loi -> 500
    if (res.length > 0) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
      data.data = null;
    }
  } catch (e) {
    data.status = 500;
  }
  return data;
};

const getResultWithMaKetQua = async (idResult) => {
  const data = {
    status: null,
    data: null,
  };

  try {
    const res = await db.Result.findAll({
      raw: true,
      where: {
        MaKetQua: idResult,
      },
    });
    //neu ton tai -> 200
    // khong ton tai -> 400
    //truy van loi -> 500
    if (res.length > 0) {
      data.status = 200;
      data.data = res;
    } else {
      data.status = 404;
      data.data = null;
    }
  } catch (e) {
    data.status = 500;
  }
  return data;
};

const getResultWithDate = async (Date) => {};

const getResultbyIdStuandIdResult = async (mkq) => {
  try {
    const result = await db.Result.findAll({
      where: {
        MaKetQua: mkq,
      },
      raw: true,
    });
    return result[0].Diem;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return null;
  }
};

const getResultListofStudent = async (msv) => {
  try {
    const resultList = await db.Result.findAll({
      where: {
        MSV: msv,
      },
      order: [["ThoiGianLamBai", "DESC"]],
      raw: true,
    });
    return resultList;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return null;
  }
};

const tinhdiem = async (questionList, testID, t) => {
  questionList.sort((a, b) => {
    if (a.macauhoi < b.macauhoi) {
      return -1;
    }
    if (a.macauhoi > b.macauhoi) {
      return 1;
    }
    return 0;
  });
  let cauhoi = [];
  try {
    cauhoi = await db.Option.findAll({
      where: {
        MaBaiThi: testID,
        Dung: "1",
      },
      attributes: ["MaCauHoi", "MaLuaChon"],
      raw: true,
      transaction: t,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    await t.rollback();
  }
  cauhoi.sort((a, b) => {
    if (a.macauhoi < b.macauhoi) {
      return -1;
    }
    if (a.macauhoi > b.macauhoi) {
      return 1;
    }
    return 0;
  });

  let diem = [];
  for (var i = 0; i < questionList.length; i++) {
    if (questionList[i].maluachon == cauhoi[i].MaLuaChon) {
      diem[i] = 1;
    } else diem[i] = 0;
  }
  return diem;
};

const createNewResult = async (msv, test, questionList) => {
  let t;
  try {
    t = await sequelize.transaction();
    var diem = await tinhdiem(questionList, test.mabaithi, t);

    let tongdiem = 0;
    diem.forEach((element) => {
      // Thực hiện công việc với mỗi phần tử
      tongdiem += element;
    });
    tongdiem = ((tongdiem / diem.length) * 10).toFixed(2);
    let result = await db.Result.create(
      {
        MSV: msv,
        MaBaiThi: test.mabaithi,
        Diem: tongdiem,
        // ThoiGianLamBai: test.start,
        // ThoiGianNopBai: test.finish,
      },
      { transaction: t }
    );

    // for (var i = 0; i < questionList.length; i++) {
    //   if(questionList[i].maluachon != 'E') {
    //     await createNewDetail(
    //       questionList[i],
    //       result.dataValues.MaKetQua,
    //       test.mabaithi,
    //       i + 1,
    //       diem[i],
    //       t
    //     );
    //   }
    // }
    await createNewDetail(questionList, result, test, diem, t);
    await t.commit();
    return result;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    await t.rollback();
    return false;
  }
};

const createSubmitCode = async (
  msv,
  submitid,
  problemname,
  namestatus,
  uri
) => {
  try {
    let submit = await db.Submit.create({
      MaSubmit: submitid,
      MSV: msv,
      TenVanDe: problemname,
      TrangThai: namestatus,
      Source: uri,
    });
  } catch (error) {}
};

const tinhdiem2 = async (questionList, dsCau, cauhoi) => {
  let diem = 0;
  if (dsCau != null) {
    const dscauArray = dsCau.match(/C\d{2}/g);

    if (dscauArray) {
      // Sắp xếp mảng questions theo thứ tự trong danhSachArray
      const sortedQuestions = cauhoi.sort((a, b) => {
        return dscauArray.indexOf(a.MaCauHoi) - dscauArray.indexOf(b.MaCauHoi);
      });
    } else {
    }
  }
  for (var i = 0; i < (questionList != null ? questionList.length : 0); i++) {
    if (questionList[i] == cauhoi[i].MaLuaChon) {
      diem += 10 / questionList.length;
    }
  }
  return diem;
};

const resultAllThi = async (mbt) => {
  let results = await db.ResultTest.findAll({
    where: {
      MaBaiThi: mbt,
      ThoiGianNopBai: {
        [Op.ne]: null,
      },
      Diem: {
        [Op.is]: null,
      },
    },
  });

  if (results == null) return false;
  else {
    let cauhoi = [];
    try {
      cauhoi = await db.Option.findAll({
        where: {
          MaBaiThi: mbt,
          Dung: "1",
        },
        attributes: ["MaCauHoi", "MaLuaChon"],
        raw: true,
      });
    } catch (error) {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      return;
    }
    // cauhoi.sort((a, b) => {
    //   if (a.macauhoi < b.macauhoi) {
    //     return -1;
    //   }
    //   if (a.macauhoi > b.macauhoi) {
    //     return 1;
    //   }
    //   return 0;
    // });
    for (let i = 0; i < results.length; i++) {
      let diem = await tinhdiem2(
        results[i].ChiTiet,
        results[i].DanhSachCau,
        cauhoi
      );
      await db.ResultTest.update(
        {
          Diem: diem,
        },
        {
          where: {
            MSV: results[i].MSV,
            MaBaiThi: mbt,
          },
        }
      );
    }
    return true;
  }
};

const getAllNewResults = async (mbt) => {
  try {
    let results = await db.ResultTest.findAll({
      where: {
        MaBaiThi: mbt,
      },
    });

    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  } catch (error) {
    return null;
  }
};
const getOptions = async (mbt) => {
  let cauhoi = [];
  try {
    cauhoi = await db.Option.findAll({
      where: {
        MaBaiThi: mbt,
      },
      attributes: ["MaCauHoi", "MaLuaChon", "NoiDung", "Dung"],
      raw: true,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return;
  }
  cauhoi.sort((a, b) => {
    if (a.macauhoi < b.macauhoi) {
      return -1;
    }
    if (a.macauhoi > b.macauhoi) {
      return 1;
    }
    return 0;
  });

  return cauhoi;
};

module.exports = {
  getResultWithIdResult,
  getResultWithDate,
  getResultByIdStuAndIdTest,
  getResultListofStudent,
  getResultbyIdStuandIdResult,
  createNewResult,
  getResultByIdTest,
  getResultWithMaKetQua,
  createSubmitCode,
  resultAllThi,
  getResultByIdThi,
  getResultThiByIdStuAndIdTest,
  getOptions,
  getAllNewResults,
};
