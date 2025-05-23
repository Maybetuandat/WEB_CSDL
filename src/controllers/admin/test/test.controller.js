// const { param } = require('../../../../routes/api.route');
const {
  getTestById,
  getCountTestWithFindObject,
  getTestWithFindObject,
  getCountTestWithFindObjectUser,
  getTestWithFindObjectUser,
} = require("../../../services/test.service");
// const { getQuestionOfTest } = require('../../../routes/api.route');
const paginationHelper = require("../../../helpers/paginationHelper");
const { Op } = require("sequelize");
const { testService } = require("../../../services/test.service");
const {
  getQuestionOfTest,
  getQuestionOfTestAdmin,
} = require("../../../services/question.service");

const testListPaginate = async (req, res) => {
  const find = {};
  const ten = req.query.name;
  if (ten) {
    find.Ten = ten;
  }

  if (req.query.keyword) {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { TenBaiThi: { [Op.regexp]: regexExpression } },
      { MaBaiThi: { [Op.regexp]: regexExpression } },
    ];
  }

  const count = await getCountTestWithFindObject(find);
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    count.data ? count.data.length : 0
  );
  const testList = await getTestWithFindObject(find, pagination);

  var data = testList.data;

  if (data != null) {
    for (var i = 0; i < data.length; i++) {
      var y = data[i].ThoiGianBatDau;
      var timeFormat = new Date(y);
      data[i].ThoiGianBatDau = timeFormat.toLocaleString();
    }
  }

  res.render("admin/pages/viewTest/index.pug", {
    titlePage: "Danh sách bài thi",
    className: ten || "Tất cả",
    tests: data,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};

const createNewTest = async (req, res) => {
  res.render("admin/pages/viewTest/newTest.pug", {
    titlePage: "Tạo mới bài thi",
  });
};

const createNewTestUser = async (req, res) => {
  res.render("user/pages/viewTest/newTest.pug", {
    titlePage: "Tạo mới bài thi",
  });
};

const EditTest = async (req, res) => {
  const testId = req.params.id;

  var metadata = await getTestById(testId);
  var questions = await getQuestionOfTestAdmin(testId);

  const startTime = metadata.data.ThoiGianBatDau;

  const datetimeString = startTime.toISOString();

  const datePart = datetimeString.split("T")[0];
  const timePart = datetimeString.split("T")[1].split(".")[0];

  metadata.data.date = datePart;
  metadata.data.time = timePart;

  var list = questions.data;

  res.render("admin/pages/viewTest/editTest.pug", {
    titlePage: "Chỉnh sửa bài thi",
    metadata: metadata.data,
    questions: list,
  });
};

const UserEditTest = async (req, res) => {
  const testId = req.params.id;

  var metadata = await getTestById(testId);
  var questions = await getQuestionOfTest(testId);

  const startTime = metadata.data[0].ThoiGianBatDau;

  const datetimeString = startTime.toISOString();

  const datePart = datetimeString.split("T")[0];
  const timePart = datetimeString.split("T")[1].split(".")[0];

  metadata.data[0].date = datePart;
  metadata.data[0].time = timePart;

  var list = questions.data;

  res.render("user/pages/viewTest/editTest.pug", {
    titlePage: "Chỉnh sửa bài thi",
    metadata: metadata.data[0],
    questions: list,
  });
};

const testListPaginateUser = async (req, res) => {
  let msv = req.jwtDecoded.data.id;

  const find = {};
  const ten = req.query.name;
  if (ten) {
    find.Ten = ten;
  }

  if (req.query.keyword) {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { TenBaiThi: { [Op.regexp]: regexExpression } },
      { MaBaiThi: { [Op.regexp]: regexExpression } },
    ];
  }

  const count = await getCountTestWithFindObjectUser(find, msv);
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    count.data ? count.data.length : 0
  );
  const testList = await getTestWithFindObjectUser(find, msv, pagination);

  var data = testList.data;

  if (data != null) {
    for (var i = 0; i < data.length; i++) {
      var y = data[i].ThoiGianBatDau;
      var timeFormat = new Date(y);
      data[i].ThoiGianBatDau = timeFormat.toLocaleString();
    }
  }

  res.render("user/pages/viewTest/index.pug", {
    titlePage: "Danh sách bài thi",
    className: ten || "Tất cả",
    tests: data,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};

module.exports = {
  createNewTest,
  createNewTestUser,
  EditTest,
  UserEditTest,
  testListPaginate,
  testListPaginateUser,
};
