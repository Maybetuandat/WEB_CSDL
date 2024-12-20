const testServices = require("../../../services/test.service");
const {
  getQuestionOfTest,
  getOneQuestion,
  getQuestionOfTestUser,
} = require("../../../services/question.service");

const thiService = require("../../../services/thi.service");
const jwtHelper = require("../../../helpers/jwt.helper");
const queryServices = require("../../../test/services/query.services");

module.exports.index = async (req, res) => {
  const thiList = await testServices.getThiList(req.jwtDecoded.data.id);
  for (let i = 0; i < (thiList.data ? thiList.data.length : 0); i++) {
    if (thiList.data[i].TheLoai == "sql") {
      thiList.data[i].ThoiGianThi =
        (thiList.data[i]["Shifts.end"].getTime() -
          (new Date().getTime() + 7 * 60 * 60 * 1000)) /
        60000; // Tính chênh lệch
      thiList.data[i].ThoiGianThi = Math.round(thiList.data[i].ThoiGianThi);
    }
  }

  let results = [];
  for (let i = 0; i < (thiList.data ? thiList.data.length : 0); i++) {
    let result = await thiService.getResultThiStuTest(
      req.jwtDecoded.data.id,
      thiList.data[i].MaBaiThi
    );
    results.push(result);
  }
  console.log(results);
  res.render("user/pages/test_list/thiList.pug", {
    titlePage: "Thực hành",
    tests: thiList.data,
    results: results,
  });
};

module.exports.testWithId = async (req, res) => {
  try {
    const testId = req.params.testId;
    const test = await testServices.getTestById(testId);
    const currentTime = new Date();
    const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ vào thời gian hiện tại
    let questions = null;
    let result = null;

    // Kiểm tra nếu không phải thể loại "sql"
    if (test.data && test.data.TheLoai == "trắc nghiệm") {
      if (test.data.TrangThai === "th") {
        questions = await getQuestionOfTest(testId, test.data.TheLoai);

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
              test.data.ThoiGianThi * 60 * 1000 ||
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
        if (
          result.data.ThoiGianLamBai.getTime() +
            test.data.ThoiGianThi * 60 * 1000 >
          req.shift.end.getTime()
        ) {
          test.data.ThoiGianThi =
            (req.shift.end.getTime() - result.data.ThoiGianLamBai.getTime()) /
            60000;
        }
      }

      const data = {
        test: test.data ? test.data : null,
        questions: questions?.data || null,
        time: result?.data?.ThoiGianLamBai || null,
      };

      return res.render("user/pages/viewResult/thiResultStudent.pug", { data });
    } else if (test.data && test.data.TheLoai === "sql") {
      // Xử lý cho thể loại "sql"
      if (test.data && test.data.TrangThai === "th") {
        questions = await getQuestionOfTest(testId, test.data.TheLoai);
        result = await thiService.getSqlResult(req.jwtDecoded.data.id, testId);
      } else {
        test.data = null;
      }

      const data = {
        test: test?.data || null,
        questions: questions?.data || null,
        time: req.shift.end.getTime(),
        result: result?.data || null,
      };

      return res.render("user/pages/viewResult/thiResultStudent2.pug", {
        data,
      });
    } else if (test.data && test.data.TheLoai === "tự luận") {
      if (test.data && test.data.TrangThai === "th") {
        questions = await getQuestionOfTest(testId, test.data.TheLoai);
        result = await thiService.getSqlResult(req.jwtDecoded.data.id, testId);
      } else {
        test.data = null;
      }

      const data = {
        test: test?.data || null,
        questions: questions?.data || null,
        time: req.shift.end.getTime(),
        result: result?.data || null,
      };
      console.log(data);
      return res.render("user/pages/viewResult/thiResultStudent3.pug", {
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

  var test = reqBody.metadata[0];
  var ans = reqBody.option;

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
  try {
    const query = req.body;
    let msv = req.jwtDecoded.data.id;
    // Sử dụng Promise.all để chạy song song
    const [update, schema, answerSql, question] = await Promise.all([
      thiService.updateDetailSql(msv, query),
      thiService.getSchemaTc(query.mabaithi),
      thiService.getAnswerSql(query.mabaithi, query.macauhoi),
      getOneQuestion(query.mabaithi, query.macauhoi),
    ]);
    if (!update) res.status(500).json({ message: "Internal Server Error" });
    const [result, rightAnswer] = await Promise.all([
      queryServices.executeUserQueryInTc(query, schema, question, answerSql),
      queryServices.getAnswerSql(query, schema, question, answerSql),
    ]);
    let status;
    if (JSON.stringify(result) === JSON.stringify(rightAnswer)) {
      console.log("true");
      status = true;
    } else {
      console.log("false");
      status = false;
    }
    const update2 = await thiService.updateResultSql(msv, query, status);
    console.log(update2);
    if (!update2) res.status(500).json({ message: "Internal Server Error" });
    console.log(result);
    console.log(rightAnswer);

    // res.status(200).json({ rightAnswer, result, status });
    res.status(200).json({ status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.postRunSql = async (req, res) => {
  try {
    const query = req.body;
    // let msv = req.jwtDecoded.data.id;
    // Sử dụng Promise.all để chạy song song
    const [schema, answerSql, question] = await Promise.all([
      // thiService.updateDetailSql(msv, query),
      thiService.getSchema(query.mabaithi),
      thiService.getAnswerSql(query.mabaithi, query.macauhoi),
      getOneQuestion(query.mabaithi, query.macauhoi),
    ]);
    console.log(answerSql);
    // if (!update) res.status(500).json({ message: "Internal Server Error" });
    const [result] = await Promise.all([
      queryServices.executeUserQuery(query, schema, question, answerSql),
    ]);
    // let status;
    // if (JSON.stringify(result) === JSON.stringify(rightAnswer)) {
    //   console.log("true");
    //   status = true;
    // } else {
    //   console.log("false");
    //   status = false;
    // }
    // const update2 = await thiService.updateResultSql(msv, query, status);
    // console.log(update2);
    // if (!update2) res.status(500).json({ message: "Internal Server Error" });
    console.log(result);
    // res.status(200).json({ rightAnswer, result, status });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.postSubmitTuLuan = async (req, res) => {
  try {
    const query = req.body;
    let msv = req.jwtDecoded.data.id;
    const update = await thiService.updateDetailSql(msv, query);
    if (!update) res.status(500).json({ message: "Internal Server Error" });

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
