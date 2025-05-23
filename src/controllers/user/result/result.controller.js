const studentController = require("../../student.controllers");
const testController = require("../../test.controllers");
const studentServices = require("../../../services/student.service");
const testServices = require("../../../services/test.service");
const resultServices = require("../../../services/result.services");
const resultController = require("../../result.controllers");
const paginationHelper = require("../../../helpers/paginationHelper");
const searchHelper = require("../../../helpers/search");
const { Op } = require("sequelize");
const jwtHelper = require("../../../helpers/jwt.helper");
const {
  getQuestionOfTest,
  getQuestionOfTestUser,
} = require("../../../services/question.service");
var request = require("request");
const path = require("path");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("user/pages/viewResult/index.pug", {
    titlePage: "Trang chủ",
  });
};
// [GET] /admin/my-account
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
module.exports.student = async (req, res) => {
  const find = {};
  const lop = req.query.class;
  if (lop) {
    find.Lop = lop;
  }

  if (req.query.keyword) {
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
  res.render("user/pages/viewResult/student.pug", {
    titlePage: "Kết quả sinh viên",
    className: lop || "Tất cả",
    studentList: studentList.data,
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
  res.render("user/pages/viewResult/studentDetail.pug", {
    titlePage: "Kết quả sinh viên",
    student: student.data[0],
    testList: testListWithPage.data,
    pagination: pagination,
  });
};

// [GET] /admin/my-account
module.exports.test = async (req, res) => {
  const find = {};
  if (req.query.keyword) {
    const regexExpression = new RegExp(req.query.keyword, "i").source;
    find.TenBaiThi = { [Op.regexp]: regexExpression };
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
  // let token
  // if(req.token) token = req.token
  res.render("user/pages/viewResult/test.pug", {
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
  const currentTime = new Date();
  // Cộng thêm 7 giờ vào thời gian hiện tại
  const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000);
  var questions = null;
  if (test.data[0].TrangThai != "th") {
    questions = await getQuestionOfTest(testId);
  } else test.data = null;
  //var questions = await getQuestionOfTest(testId);
  const data = {
    test: test && test.data ? test.data[0] : null,
    questions: questions && questions.data ? questions.data : null,
  };

  var tmp = "hiep";
  res.render("user/pages/viewResult/testResultStudent.pug", {
    data: data,
  });
};

module.exports.testListForStudent = async (req, res) => {
  const find = {};
  if (req.query.keyword) {
    const keyword = escapeRegex(req.query.keyword);
    const regexExpression = new RegExp(keyword, "i").source;
    find[Op.or] = [
      { TenBaiThi: { [Op.regexp]: regexExpression } },
      //{ TheLoai: { [Op.regexp]: regexExpression } },
      //{ TacGia: { [Op.regexp]: regexExpression } },
    ];
  }
  const count = await testServices.getCountTestListForStudentWithFindObject(
    find
  );
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    count.data ? count.data.length : 0
  );
  const testListForStudent =
    await testServices.getTestListForStudentWithFindObject(find, pagination);

  res.render("user/pages/test_list/testList.pug", {
    titlePage: "Danh sách bài thi",
    tests: testListForStudent.data,
    keyword: req.query.keyword || "",
    pagination: pagination,
  });
};

module.exports.codeListForStudent = async (req, res) => {
  // const testListForStudent = await testServices.getTestListForStudent();
  let tmp = "hiep";
  // res.sendFile("D:/CODE/backend_1 - Copy/src/views/user/pages/test_list/codeList.html", tmp);
  let codeList = await testServices.getAllProbPerPage(1);

  res.render("user/pages/test_list/codeList.pug", {
    codeList: codeList.data,
  });
};

module.exports.widgetProb = async (req, res) => {
  let idProb = req.params.idProb;
  let filename = idProb + ".html";

  // Get the relative path to the problist directory
  const problistPath = path.join(
    __dirname,
    "../../../views/user/pages/test_list/problist/"
  );

  // Use path.join again to add the filename to the path
  const filePath = path.join(problistPath, filename);

  res.sendFile(filePath);
};
// [GET] /admin/my-account

module.exports.resultTestOfStudent = async (req, res) => {
  const testList = await testServices.getTestByStudentId(
    req.jwtDecoded.data.id
  );
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    testList.data.length
  );
  const student = await studentServices.getStudentById(req.jwtDecoded.data.id);
  const testListWithPage = await testServices.getTestByStudentIdWithPage(
    req.jwtDecoded.data.id,
    pagination
  );

  res.render("user/pages/viewResult/testResult.pug", {
    titlePage: "Kết quả sinh viên",
    student: student.data && student.data[0] ? student.data[0] : null,
    testList: testListWithPage.data,
    pagination: pagination,
  });
};

module.exports.submitOfStudent = async (req, res) => {
  const submitList = await testServices.getSubmitByStudentId(
    req.jwtDecoded.data.id
  );
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 5,
    },
    req.query,
    submitList.data.length
  );
  const submitListWithPage = await testServices.getSubmitByStudentIdWithPage(
    req.jwtDecoded.data.id,
    pagination
  );
  // submitListWithPage.data.sort((a, b) => b.id - a.id);

  res.render("user/pages/viewResult/codeResult.pug", {
    titlePage: "Kết quả sinh viên",
    submitList: submitListWithPage.data,
    pagination: pagination,
  });
};

module.exports.source = async (req, res) => {
  let url = await testServices.getURL(req.params.idSubmit);

  request(
    {
      url: url,
      method: "GET",
    },
    function (error, response, body) {
      if (error) {
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          let source = response.body;
          res.render("user/pages/viewResult/source.pug", {
            source: source,
          });
        } else {
          if (response.statusCode === 401) {
          } else if (response.statusCode === 403) {
          } else if (response.statusCode === 404) {
          }
        }
      }
    }
  );
};

module.exports.detailStudentAndTest = async (req, res) => {
  const result = await resultController.getDetailTestWithIdStuAndIdResult(
    req.jwtDecoded.data.id,
    req.params.idResult
  );

  if (result && result.result) {
    console.log(detail);
    res.render("user/pages/viewResult/studentAndTestDetail.pug", {
      titlePage: "Kết quả sinh viên",
      result: result.result.data[0],
      student: result.student.data[0],
      test: result.test.data[0],
      detail: result.detail,
    });
  } else {
    res.render("user/pages/viewResult/studentAndTestDetail.pug", {
      titlePage: "Kết quả sinh viên",
      result: null,
      student: null,
      test: null,
      detail: null,
    });
  }
};
