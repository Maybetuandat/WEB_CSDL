const { default: Transaction } = require("sequelize/lib/transaction");
const db = require("../models/index");
const _ = require("lodash");

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

const getQuestionOfTest = async (id, theloai) => {
  var data = { status: null, data: null };
  try {
    var questions = await db.Question.findAll({
      where: {
        MaBaiThi: id,
      },
      raw: true,
    });
    if (theloai == "tự luận") {
      if (questions.length > 0) {
        data.status = 200;
        data.data = questions;
      } else {
        data.status = 404;
      }
      return data;
    }
    var allOptions = await db.Option.findAll({
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
  console.log("hello");
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
      console.log(questions);
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

const createNewQuestion = async (question, testId, index, t) => {
  try {
    await db.Question.create(
      {
        MaCauHoi: "C" + String(index).padStart(2, "0"),
        MaBaiThi: testId,
        DeBai: question.questionContent,
        SoThuTu: index,
        TheLoai: "Trắc nghiệm",
      },
      { transaction: t }
    );
    for (var i = 1; i <= 4; i++) {
      var answerProperty = "answer" + i;
      var correct = 0;
      if (question.check == i) {
        correct = 1;
      }
      await db.Option.create(
        {
          MaCauHoi: "C" + String(index).padStart(2, "0"),
          MaLuaChon: String.fromCharCode("A".charCodeAt(0) + i - 1),
          MaBaiThi: testId,
          Dung: correct,
          NoiDung: question[answerProperty],
        },
        { transaction: t }
      );
    }
  } catch (error) {
    t.rollback();
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

module.exports = {
  getAllQuestion,
  getQuestionOfTest,
  getQuestionOfTest2,
  createNewQuestion,
  getQuestionOfTestUser,
  getQuestionOfTestAdmin,
};
