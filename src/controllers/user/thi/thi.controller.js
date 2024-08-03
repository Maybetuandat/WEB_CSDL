const testServices = require("../../../services/test.service");
const {
  getQuestionOfTest,
  getQuestionOfTestUser,
} = require("../../../services/question.service");

const thiService = require("../../../services/thi.service");
const jwtHelper = require("../../../helpers/jwt.helper");

module.exports.index = async (req, res) => {
  const thiList = await testServices.getThiList();
  console.log(thiList);
  let results = [];
  for (let i = 0; i < thiList.data.length; i++) {
    let result = await thiService.getResultThiStuTest(
      req.jwtDecoded.data.id,
      thiList.data[i].MaBaiThi
    );
    results.push(result);
  }
  // console.log(testListForStudent);
  res.render("user/pages/test_list/thiList.pug", {
    titlePage: "Thực hành",
    tests: thiList.data,
    results: results,
  });
};

module.exports.testWithId = async (req, res) => {
  const testId = req.params.testId;
  const test = await testServices.getThiById(testId);
  const currentTime = new Date();
  // Cộng thêm 7 giờ vào thời gian hiện tại
  const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000);
  var questions = null;
  let result = null;
  if (test.data) {
    if (test.data[0].TrangThai == "th") {
      result = await thiService.getThiResult(
        req.jwtDecoded.data.id,
        testId,
        updatedTime
      );
      console.log(result);
      if (
        updatedTime.getTime() - result.data.ThoiGianLamBai.getTime() >
          test.data[0].ThoiGianThi * 60 * 1000 ||
        result.data.ThoiGianNopBai != null
      ) {
        test.data = null;
      } else {
        questions = await getQuestionOfTest(testId);
      }
    } else test.data = null;
  }

  //var questions = await getQuestionOfTest(testId);
  const data = {
    test: test && test.data ? test.data[0] : null,
    questions: questions && questions.data ? questions.data : null,
    time: result && result.data ? result.data.ThoiGianLamBai : null,
  };

  // console.log(data)
  var tmp = "hiep";
  res.render("user/pages/viewResult/thiResultStudent.pug", {
    data: data,
  });
};

module.exports.postSubmit = async (req, res) => {
  let msv = req.jwtDecoded.data.id;
  var reqBody = req.body;
  //console.log(reqBody)
  var test = reqBody.metadata[0];
  var ans = reqBody.option;
  console.log(reqBody);
  var result = await thiService.updateDetail(msv, test, ans);

  if (result) {
    res.status(200).json({
      code: 1,
      error: 200,
      message: "Tạo thành công!",
      data: result,
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Tạo thất bại!",
    });
  }
};
