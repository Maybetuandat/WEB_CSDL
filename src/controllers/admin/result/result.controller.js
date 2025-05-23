const studentController = require("../../student.controllers");
const studentServices = require("../../../services/student.service");
const testServices = require("../../../services/test.service");
const resultServices = require("../../../services/result.services");
const resultController = require("../../result.controllers");
const paginationHelper = require("../../../helpers/paginationHelper");
const searchHelper = require("../../../helpers/search");
const { Op } = require("sequelize");
// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/viewResult/index.pug", {
    titlePage: "Thông tin cá nhân",
  });
};
// [GET] /admin/my-account
module.exports.student = async (req, res) => {
  const find = {};
  const lop = req.query.class;
  if (lop) {
    find.Lop = lop;
  }

  if (req.query.keyword && req.query.keyword !== "") {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { Ten: { [Op.regexp]: regexExpression } },
      { MSV: { [Op.regexp]: regexExpression } },
    ];
  }

  const count = await studentServices.getCountStudentWithFindObject(find);
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    count.data ? count.data.length : 0
  );
  const studentList = await studentServices.getStudentWithFindObject(
    find,
    pagination
  );
  res.render("admin/pages/viewResult/student.pug", {
    titlePage: "Kết quả sinh viên",
    className: lop || "Tất cả",
    studentList: studentList.data ? studentList.data : null,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};
module.exports.studentWithId = async (req, res) => {
  const studentId = req.params.studentId;
  const testList = await testServices.getTestByStudentId(studentId);
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    testList.data.length
  );
  const student = await studentServices.getStudentById(studentId);
  const testListWithPage = await testServices.getTestByStudentIdWithPage(
    studentId,
    pagination
  );
  res.render("admin/pages/viewResult/studentDetail.pug", {
    titlePage: "Kết quả sinh viên",
    student: student.data[0],
    testList: testListWithPage.data,
    pagination: pagination,
  });
};
module.exports.detailStudentAndTest = async (req, res) => {
  const result = await resultController.getDetailTestWithIdStuAndIdTest(
    req.params.studentId,
    req.params.testId
  );
  res.render("admin/pages/viewResult/studentAndTestDetail.pug", {
    titlePage: "Kết quả sinh viên",
    result: result.result.data[0],
    student: result.student.data[0],
    test: result.test.data[0],
    detail: result.detail,
  });
};
module.exports.detailStudentAndThi = async (req, res) => {
  const result = await resultController.getDetailThiWithIdStuAndIdTest(
    req.params.studentId,
    req.params.testId
  );
  result.result.data.forEach((element) => {
    element.ThoiGianNopBai = element.ThoiGianNopBai.toISOString()
      .replace("T", " ")
      .replace("Z", "");
  });
  if (
    result.test.data.TheLoai == "sql" ||
    result.test.data.TheLoai == "tự luận"
  ) {
    res.render("admin/pages/viewResult/studentAndTestDetail2.pug", {
      titlePage: "Kết quả sinh viên",
      result: result.result.data,
      student: result.student.data[0],
      test: result.test.data,
      detail: result.detail,
    });
  } else {
    res.render("admin/pages/viewResult/studentAndTestDetail.pug", {
      titlePage: "Kết quả sinh viên",
      result: result.result.data[0],
      student: result.student.data[0],
      test: result.test.data,
      detail: result.detail,
    });
  }
};
// [GET] /admin/my-account
module.exports.test = async (req, res) => {
  const find = {};
  if (req.query.keyword && req.query.keyword !== "") {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { TenBaiThi: { [Op.regexp]: regexExpression } },
      { TheLoai: { [Op.regexp]: regexExpression } },
    ];
  }
  const testList = await testServices.getAllTest();
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    testList.data.length
  );
  const testListWithPage = await testServices.getTestWithFindObjectAndPage(
    find,
    pagination
  );

  res.render("admin/pages/viewResult/test.pug", {
    // token: token,
    titlePage: "Kết quả bài thi",
    tests: testListWithPage.data,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};
module.exports.testWithId = async (req, res) => {
  const testId = req.params.testId;
  const test = await testServices.getTestById(testId);
  const resultList = await resultServices.getAllNewResults(testId);
  const studentList = [];
  const find = {};
  if (req.query.keyword && req.query.keyword !== "") {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { Ten: { [Op.regexp]: regexExpression } },
      { MSV: { [Op.regexp]: regexExpression } },
    ];
  }
  if (req.query.class) find.Lop = req.query.class;
  if (resultList.length > 0) {
    for (let i = 0; i < resultList.length; i++) {
      if (resultList[i].Diem == null) {
        resultList[i].Diem = "Chưa xong";
      }

      find.MSV = resultList[i].MSV;
      const student = await studentServices.getCountStudentWithFindObject(find);
      if (student.data) studentList.push(student.data[0]);
    }
  }

  res.render("admin/pages/viewResult/testResultStudent.pug", {
    titlePage: "Kết quả bài thi",
    test: test.data[0],
    resultList: resultList,
    studentList: studentList,
    className: req.query.class || "Tất cả",
    keyword: req.query.keyword || "",
  });
};

module.exports.chamThi = async (req, res) => {
  await resultServices.resultAllThi(req.params.testId);
};

module.exports.thi = async (req, res) => {
  const find = {};
  if (req.query.keyword && req.query.keyword !== "") {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [{ TenBaiThi: { [Op.regexp]: regexExpression } }];
  }
  const testList = await testServices.getAllThi();
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    testList.data?.length || 0
  );
  const testListWithPage = await testServices.getThiWithFindObjectAndPage(
    find,
    pagination
  );

  res.render("admin/pages/viewResult/thi.pug", {
    // token: token,
    titlePage: "Kết quả bài thi",
    tests: testListWithPage.data,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};

module.exports.thiWithId = async (req, res) => {
  const testId = req.params.testId;
  const test = await testServices.getTestById(testId);
  const resultList = await resultServices.getResultByIdThi(
    testId,
    test.data.TheLoai
  );
  const studentList = [];
  const find = {};
  if (req.query.keyword && req.query.keyword !== "") {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find[Op.or] = [
      { Ten: { [Op.regexp]: regexExpression } },
      { MSV: { [Op.regexp]: regexExpression } },
    ];
  }
  if (req.query.class) find.Lop = req.query.class;
  for (let i = 0; i < resultList.data.length; i++) {
    find.MSV = resultList.data[i].MSV;
    const student = await studentServices.getCountStudentWithFindObject(find);
    if (student.data) studentList.push(student.data[0]);
  }

  res.render("admin/pages/viewResult/thiResultStudent.pug", {
    titlePage: "Kết quả bài thi",
    test: test.data,
    resultList: resultList.data,
    studentList: studentList,
    className: req.query.class || "Tất cả",
    keyword: req.query.keyword || "",
  });
};

// [GET] /admin/my-account
