const { default: Transaction } = require("sequelize/lib/transaction");
const db = require("../models/index");
const _ = require("lodash");
const { where } = require("sequelize");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../../images/test");

const getAllQuestion = async () => {
  var data = { status: null, data: null };
  try {
    const questions = await db.Question.findAll();
    if (questions.length > 0) {
      data.status = 200;
      data.data = questions;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

function shuffleLast10KeepRest(array) {
  const n = array.length;

  // Nếu mảng có nhiều hơn 10 phần tử
  if (n > 10) {
    // Tách 10 phần tử cuối
    const last10 = array.slice(-10);
    // Xáo trộn 10 phần tử cuối
    const shuffledLast10 = _.shuffle(last10);
    // Tách phần còn lại của mảng
    const remaining = _.shuffle(array.slice(0, -10));
    // Ghép phần đã xáo trộn với phần còn lại
    return [...remaining, ...shuffledLast10];
  } else return _.shuffle(array);

  // Nếu mảng có 10 phần tử hoặc ít hơn, không cần xáo trộn
  return array;
}

const getOneQuestion = async (mbt, mch) => {
  try {
    let question = await db.Question.findOne({
      where: {
        MaBaiThi: mbt,
        MaCauHoi: "C" + String(mch).padStart(2, "0"),
      },
      raw: true,
    });
    return question;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getQuestionOfTest = async (id, theloai) => {
  var data = { status: null, data: null };
  try {
    var questions = await db.Question.findAll({
      where: {
        MaBaiThi: id,
      },
      raw: true,
    });
    if (theloai == "sql" || theloai == "tự luận") {
      if (questions.length > 0) {
        data.status = 200;
        data.data = questions;
      } else {
        data.status = 404;
      }
      return data;
    }
    var allOptions = await db.Option.findAll({
      where: {
        MaBaiThi: id,
      },
      attributes: {
        exclude: ["Dung"], // Loại trừ cột `Dung`
      },
      raw: true,
    });
    for (var question of questions) {
      var filterOptions = await allOptions.filter(
        (option) =>
          option.MaBaiThi === question.MaBaiThi &&
          option.MaCauHoi === question.MaCauHoi
      );

      question.LuaChon = filterOptions.map((option) => {
        const { MaBaiThi, MaCauHoi, ...rest } = option;
        return rest;
      });
    }

    questions = await questions.map((question) => {
      const { MaBaiThi, ...rest } = question;
      return rest;
    });
    questions = shuffleLast10KeepRest(questions);
    if (questions.length > 0) {
      data.status = 200;
      data.data = questions;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

const getQuestionOfTest2 = async (id) => {
  var data = { status: null, data: null };
  try {
    var questions = await db.Question.findAll({
      where: {
        MaBaiThi: id,
      },
      raw: true,
    });
    var allOptions = await db.Option.findAll({
      raw: true,
    });
    for (var question of questions) {
      var filterOptions = await allOptions.filter(
        (option) =>
          option.MaBaiThi === question.MaBaiThi &&
          option.MaCauHoi === question.MaCauHoi
      );

      question.LuaChon = filterOptions.map((option) => {
        const { MaBaiThi, MaCauHoi, ...rest } = option;
        return rest;
      });
    }

    questions = await questions.map((question) => {
      const { MaBaiThi, ...rest } = question;
      return rest;
    });
    questions = shuffleLast10KeepRest(questions);
    if (questions.length > 0) {
      data.status = 200;
      data.data = questions;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

const getQuestionOfTestAdmin = async (id) => {
  var data = { status: null, data: null };
  try {
    var questions = await db.Question.findAll({
      where: {
        MaBaiThi: id,
      },
      raw: true,
    });
    var allOptions = await db.Option.findAll({
      raw: true,
    });
    for (var question of questions) {
      var filterOptions = await allOptions.filter(
        (option) =>
          option.MaBaiThi === question.MaBaiThi &&
          option.MaCauHoi === question.MaCauHoi
      );

      question.LuaChon = filterOptions.map((option) => {
        const { MaBaiThi, MaCauHoi, ...rest } = option;
        return rest;
      });
    }

    questions = await questions.map((question) => {
      const { MaBaiThi, ...rest } = question;
      return rest;
    });
    // questions = shuffleLast10KeepRest(questions);
    if (questions.length > 0) {
      data.status = 200;
      data.data = questions;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

const createNewQuestion = async (question, testId) => {
  try {
    let baithi = await db.Test.findOne({
      where: {
        MaBaiThi: testId,
      },
      //lấy ra 1 trường chỉ định
      attributes: ["SoLuongCau", "TheLoai"],
    });
    let index = baithi.SoLuongCau + 1;

    // const fileName = `${testId}_${index}.webp`;
    // const filePath = path.join(uploadDir, fileName);
    // // console.log(filePath);
    // let imagePath = null;
    // if (fs.existsSync(filePath)) {
    //   imagePath = fileName; // Gắn tên file vào trường HinhAnh
    // }
    await db.Question.create({
      MaCauHoi: "C" + String(index).padStart(2, "0"),
      MaBaiThi: testId,
      DeBai: question.questionContent,
      SoThuTu: index,
      TheLoai:
        !question.type || question.type.trim() == ""
          ? "Trắc nghiệm"
          : question.type,
      // HinhAnh: imagePath,
    });
    if (baithi.TheLoai == "trắc nghiệm") {
      for (var i = 1; i <= 4; i++) {
        var answerProperty = "answer" + i;
        var correct = 0;
        if (question.check == i) {
          correct = 1;
        }
        // let fileNameOption = `${testId}_${index}_${i}.webp`;
        // let filePathOption = path.join(uploadDir, fileNameOption);

        // let imagePathOption = null;
        // if (fs.existsSync(filePathOption)) {
        //   imagePathOption = fileNameOption; // Gắn tên file vào trường HinhAnh
        // }
        // console.log("wtf: ", imagePathOption);
        // console.log("wtf2: ", fileNameOption);
        await db.Option.create({
          MaCauHoi: "C" + String(index).padStart(2, "0"),
          MaLuaChon: String.fromCharCode("A".charCodeAt(0) + i - 1),
          MaBaiThi: testId,
          Dung: correct,
          NoiDung: question[answerProperty],
          // HinhAnh: imagePathOption,
        });
      }
    } else {
      await db.AnswerSql.create({
        MaBaiThi: testId,
        Cau: index,
        ChiTiet: question.answer,
        BangMucTieu: question.table,
      });
    }
    await db.Test.update(
      {
        SoLuongCau: index,
      },
      {
        where: {
          MaBaiThi: testId,
        },
      }
    );
    return index;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const updateImageQuestion = async (imageUrl, mbt, mch) => {
  try {
    await db.Question.update(
      { HinhAnh: imageUrl },
      {
        where: {
          MaBaiThi: mbt,
          MaCauHoi: mch,
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật hình ảnh:", error);
    return false;
  }
};
const updateImageOption = async (imageUrl, mbt, mch, mlc) => {
  try {
    await db.Option.update(
      { HinhAnh: imageUrl },
      {
        where: {
          MaBaiThi: mbt,
          MaCauHoi: mch,
          MaLuaChon: mlc,
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật hình ảnh:", error);
    return false;
  }
};
const getQuestionOfTestUser = async (id) => {
  try {
    const questions = await db.Question.findAll({
      where: {
        MaBaiThi: id,
      },
      raw: true,
    });
    const allOptions = await db.Option.findAll({
      attributes: { exclude: ["Dung"] },
    });
    for (var question of questions) {
      question.LuaChon = await allOptions.filter(
        (option) =>
          option.MaBaiThi === question.MaBaiThi &&
          option.MaCauHoi === question.MaCauHoi
      );
    }
    return questions;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return null;
  }
};

const updateQuestionById = async (testId, questionId, updateData) => {
  const question = {
    DeBai: updateData.question,
  };
  const options = [];
  updateData.options.forEach((option) => {
    options.push({ NoiDung: option.ans, Dung: parseInt(option.right) });
  });
  const promises = [];

  // Cập nhật câu hỏi
  promises.push(
    db.Question.update(question, {
      where: {
        MaBaiThi: testId,
        MaCauHoi: "C" + String(questionId).padStart(2, "0"),
      },
    })
  );

  // Cập nhật các lựa chọn
  for (let i = 0; i < 4; i++) {
    console.log(options[i].NoiDung);

    promises.push(
      db.Option.update(options[i], {
        where: {
          MaBaiThi: testId,
          MaCauHoi: "C" + String(questionId).padStart(2, "0"),
          MaLuaChon: String.fromCharCode("A".charCodeAt(0) + i), // Tăng dần từ 'A'
        },
      })
    );
  }

  try {
    Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return false;
  }
};

module.exports = {
  getAllQuestion,
  getQuestionOfTest,
  getQuestionOfTest2,
  createNewQuestion,
  updateQuestionById,
  updateImageOption,
  updateImageQuestion,
  getQuestionOfTestUser,
  getQuestionOfTestAdmin,
  getOneQuestion,
};
