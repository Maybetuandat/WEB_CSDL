const testServices = require("../../../services/test.service");
const {
  getQuestionOfTest,
  getQuestionOfTestUser,
} = require("../../../services/question.service");

const thiService = require("../../../services/thi.service");
const jwtHelper = require("../../../helpers/jwt.helper");

module.exports.index = async (req, res) => {
  const thiList = await testServices.getThiList(req.jwtDecoded.data.id);
  for (let i = 0; i < (thiList.data ? thiList.data.length : 0); i++) {
    if (thiList.data[i].TheLoai == "tự luận") {
      thiList.data[i].ThoiGianThi =
        (thiList.data[i]["Shifts.end"].getTime() -
          (new Date().getTime() + 7 * 60 * 60 * 1000)) /
        60000; // Tính chênh lệch
      thiList.data[i].ThoiGianThi = Math.round(thiList.data[i].ThoiGianThi);
    }
  }
  // console.log(thiList);
  let results = [];
  for (let i = 0; i < (thiList.data ? thiList.data.length : 0); i++) {
    let result = await thiService.getResultThiStuTest(
      req.jwtDecoded.data.id,
      thiList.data[i].MaBaiThi
    );
    results.push(result);
  }
  // // console.log(testListForStudent);
  res.render("user/pages/test_list/thiList.pug", {
    titlePage: "Thực hành",
    tests: thiList.data,
    results: results,
  });
};

module.exports.testWithId = async (req, res) => {
  try {
    const testId = req.params.testId;
    const test = await testServices.getThiById(testId);
    const currentTime = new Date();
    const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ vào thời gian hiện tại
    let questions = null;
    let result = null;

    // Kiểm tra nếu không phải thể loại "tự luận"
    if (test.data && test.data[0].TheLoai !== "tự luận") {
      if (test.data[0].TrangThai === "th") {
        questions = await getQuestionOfTest(testId, test.data[0].TheLoai);

        if (questions.data) {
          const maCauHoiArray = questions.data.map(
            (question) => question.MaCauHoi
          );
          const maCauHoiString = maCauHoiArray.join("");

          result = await thiService.getThiResult(
            req.jwtDecoded.data.id,
            testId,
            updatedTime,
            maCauHoiString
          );

          const dscauArray = result.data?.DanhSachCau.match(/C\d{2}/g);
          if (dscauArray) {
            // Sắp xếp questions theo thứ tự trong dscauArray
            questions.data.sort(
              (a, b) =>
                dscauArray.indexOf(a.MaCauHoi) - dscauArray.indexOf(b.MaCauHoi)
            );
            questions.data = questions.data.map(
              ({ MaCauHoi, ...rest }) => rest
            );
          }

          // Kiểm tra thời gian làm bài và thời gian nộp bài
          if (
            updatedTime.getTime() - result.data.ThoiGianLamBai.getTime() >
              test.data[0].ThoiGianThi * 60 * 1000 ||
            result.data.ThoiGianNopBai !== null
          ) {
            test.data = null; // Bài thi đã hết hạn hoặc đã nộp bài
          }
        }
      } else {
        test.data = null;
      }

      // Điều chỉnh thời gian thi nếu cần
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

      const data = {
        test: test.data ? test.data[0] : null,
        questions: questions?.data || null,
        time: result?.data?.ThoiGianLamBai || null,
      };

      return res.render("user/pages/viewResult/thiResultStudent.pug", { data });
    } else {
      // Xử lý cho thể loại "tự luận"
      if (test.data && test.data[0].TrangThai === "th") {
        questions = await getQuestionOfTest(testId, test.data[0].TheLoai);
        result = await thiService.getSqlResult(req.jwtDecoded.data.id, testId);
      } else {
        test.data = null;
      }

      const data = {
        test: test?.data?.[0] || null,
        questions: questions?.data || null,
        time: test?.data?.[0]["Shifts.end"].getTime() - updatedTime.getTime(),
        result: result?.data || null,
      };

      return res.render("user/pages/viewResult/thiResultStudent2.pug", {
        data,
      });
    }
  } catch (error) {
    console.error("Error in testWithId:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.postSubmit = async (req, res) => {
  let msv = req.jwtDecoded.data.id;
  var reqBody = req.body;
  //// console.log(reqBody)
  var test = reqBody.metadata[0];
  var ans = reqBody.option;
  // console.log(reqBody);
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
  //// console.log(reqBody)
  // var test = reqBody.metadata;

  // console.log(reqBody);
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
