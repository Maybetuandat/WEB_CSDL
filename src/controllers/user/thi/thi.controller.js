const testServices = require("../../../services/test.service");
const {
  getQuestionOfTest,
  getQuestionOfTestUser,
} = require("../../../services/question.service");

const thiService = require("../../../services/thi.service");
const jwtHelper = require("../../../helpers/jwt.helper");

module.exports.index = async (req, res) => {
  const thiList = await testServices.getThiList(req.jwtDecoded.data.id);
  console.log(thiList);
  let results = [];
  for (let i = 0; i < (thiList.data ? thiList.data.length : 0); i++) {
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
  if (test.data[0].TheLoai != "tự luận") {
    if (test.data) {
      if (test.data[0].TrangThai == "th") {
        questions = await getQuestionOfTest(testId, test.data[0].TheLoai);
        let maCauHoiString = null;
        if (questions.data) {
          let maCauHoiArray = questions.data.map(
            (question) => question.MaCauHoi
          );
          maCauHoiString = maCauHoiArray.join("");
          console.log(maCauHoiString);

          result = await thiService.getThiResult(
            req.jwtDecoded.data.id,
            testId,
            updatedTime,
            maCauHoiString
          );

          const dscauArray = result.data.DanhSachCau.match(/C\d{2}/g);

          if (dscauArray) {
            // Sắp xếp mảng questions theo thứ tự trong danhSachArray
            const sortedQuestions = questions.data.sort((a, b) => {
              return (
                dscauArray.indexOf(a.MaCauHoi) - dscauArray.indexOf(b.MaCauHoi)
              );
            });
            questions.data = questions.data.map(
              ({ MaCauHoi, ...rest }) => rest
            );
            //console.log(sortedQuestions);
          } else {
          }

          if (
            updatedTime.getTime() - result.data.ThoiGianLamBai.getTime() >
              test.data[0].ThoiGianThi * 60 * 1000 ||
            result.data.ThoiGianNopBai != null
          ) {
            test.data = null;
          }
        }
      } else test.data = null;
      if (test.data) {
        for (let i = 0; i < test.data.length; i++) {
          if (
            result.data.ThoiGianLamBai.getTime() +
              test.data[i].ThoiGianThi * 60 * 1000 >
            test.data[i]["Shifts.end"].getTime()
          ) {
            test.data[i].ThoiGianThi =
              (test.data[i]["Shifts.end"].getTime() -
                result.data.ThoiGianLamBai.getTime()) /
              60000;
          }
        }
      }
    }

    const data = {
      test: test && test.data ? test.data[0] : null,
      questions: questions && questions.data ? questions.data : null,
      time: result && result.data ? result.data.ThoiGianLamBai : null,
    };

    res.render("user/pages/viewResult/thiResultStudent.pug", {
      data: data,
    });
  } else {
    if (test.data) {
      if (test.data[0].TrangThai == "th") {
        questions = await getQuestionOfTest(testId, test.data[0].TheLoai);
        result = await thiService.getSqlResult(req.jwtDecoded.data.id, testId);
      } else test.data = null;
    }
    // console.log(result);
    const data = {
      test: test && test.data ? test.data[0] : null,
      questions: questions && questions.data ? questions.data : null,
      time: test.data[0]["Shifts.end"].getTime() - updatedTime.getTime(),
      result: result && result.data ? result.data : null,
    };

    res.render("user/pages/viewResult/thiResultStudent2.pug", {
      data: data,
    });
  }
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

module.exports.postSubmitSql = async (req, res) => {
  let msv = req.jwtDecoded.data.id;
  var reqBody = req.body;
  //console.log(reqBody)
  // var test = reqBody.metadata;

  console.log(reqBody);
  var result = await thiService.updateDetailSql(msv, reqBody);

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
