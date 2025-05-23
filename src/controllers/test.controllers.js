const {
  getAllTest,
  getTestById,
  createNewTest,
  createNewTest2,
  deleteTestById,
  updateTestById,
  searchTestByName,
  getTestByStudentId,
  getAllTestPerPage,
  getTestByText,
  getAllProbPerPage,
} = require("../services/test.service");
const {
  getQuestionOfTest,
  getQuestionOfTestUser,
  createNewQuestion,
  updateQuestionById,
} = require("../services/question.service");
const { getStudentById } = require("../services/student.service");
const {
  getDetailListWithIdResultandIdStu,
} = require("../services/detail.services");
const {
  createNewResult,
  getResultListofStudent,
  getResultbyIdStuandIdResult,
} = require("../services/result.services");

const getTestList = async (req, res) => {
  var tests = await getAllTest();
  if (tests.status === 200) {
    var tests = await getAllTest();
    if (tests.status === 200) {
      const response = {
        code: 1,
        status: 200,
        message: "successfully",
        data: tests.data,
      };

      res.status(200).json(response);
    } else if (tests.status === 500) {
      const response = {
        code: 0,
        status: 500,
        message: "Internal Server Error",
      };

      res.status(500).json(response);
    } else {
      const response = {
        code: 0,
        status: 404,
        message: "Không tìm thấy bài thi",
      };

      res.status(404).json(response);
    }
  }
};

const getProbByPage = async (req, res) => {
  var probs = await getAllProbPerPage(1);
  if (probs.status === 200) {
    const response = {
      code: 1,
      status: 200,
      message: "successfully",
      data: probs.data,
    };
    res.status(200).json(response);
  } else if (probs.status === 500) {
    const response = {
      code: 0,
      status: 500,
      message: "Internal Server Error",
    };

    res.status(500).json(response);
  } else {
    const response = {
      code: 0,
      status: 404,
      message: "Không tìm thấy bài thi",
    };

    res.status(404).json(response);
  }
};

const getSearchTest = async (req, res) => {
  const inputText = req.query.text;
  let tests = await getTestByText(inputText);

  if (tests) {
    const response = {
      code: 1,
      status: 200,
      message: "da tim thay cac bai thi successfully",
      data: tests,
    };

    res.status(200).json(response);
  } else {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  }
};

const getTestByPage = async (req, res) => {
  var tests = await getAllTestPerPage(req.query.page);
  if (tests.status === 200) {
    const response = {
      code: 1,
      status: 200,
      message: "successfully",
      data: tests.data,
    };
    res.status(200).json(response);
  } else if (tests.status === 500) {
    const response = {
      code: 0,
      status: 500,
      message: "Internal Server Error",
    };

    res.status(500).json(response);
  } else {
    const response = {
      code: 0,
      status: 404,
      message: "Không tìm thấy bài thi",
    };

    res.status(404).json(response);
  }
};
const getTestByIdHandler = async (req, res) => {
  const testId = req.params.id;
  const metadata = await getTestById(testId);
  if (metadata.status === 200) {
    const testInfo = metadata.data;
    res.status(200).json(testInfo);
  } else if (metadata.status === 500) {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  } else {
    const response = {
      code: 0,
      status: 404,
      message: "Không tìm thấy bài thi",
    };

    res.status(404).json(response);
  }
};

const getQuestionByTestHandler = async (req, res) => {
  const testId = req.params.id;
  var metadata = await getTestById(testId);
  var questions = await getQuestionOfTest(testId);

  if (metadata.status === 200) {
    const response = {
      code: 1,
      status: 200,
      message: "successfully",
      metadata: metadata.data[0],
      data: questions.data,
    };

    res.status(200).json(response);
  } else if (metadata.status === 500) {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  } else {
    const response = {
      code: 0,
      status: 404,
      message: "Không tìm thấy bài thi",
    };

    res.status(404).json(response);
  }
};

const getQuestionHandlernoAns = async (req, res) => {
  const testId = req.params.id;
  var metadata = await getTestById(testId);
  var questions = await getQuestionOfTestUser(testId);

  if (questions) {
    const response = {
      code: 1,
      status: 200,
      message: "lay cau hoi successfully",
      metadata: metadata[0],
      data: questions,
    };

    res.status(200).json(response);
  } else {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  }
};

const getResultList = async (req, res) => {
  let msv = req.params.msv;

  let resultList = await getResultListofStudent(msv);

  if (resultList) {
    const response = {
      code: 1,
      status: 200,
      message: "lay lich su successfully",
      data: resultList,
    };

    res.status(200).json(response);
  } else {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  }
};

const getDetailList = async (req, res) => {
  let mkq = req.params.mkq;
  let msv = req.params.msv;

  let detailList = await getDetailListWithIdResultandIdStu(mkq, msv);
  let mabaithi = detailList[0].MaBaiThi;
  detailList = detailList.map((detail) => {
    const { MaBaiThi, MaCauHoi, MaKetQua, ...rest } = detail;
    return rest;
  });
  let diem = await getResultbyIdStuandIdResult(mkq);

  if (detailList) {
    const response = {
      code: 1,
      status: 200,
      message: "lay chi tiet successfully",
      maketqua: mkq,
      mabaithi: mabaithi,
      diem: diem,
      data: detailList,
    };

    res.status(200).json(response);
  } else {
    const response = {
      code: 0,
      status: 500,
      message: "internal server error",
    };

    res.status(500).json(response);
  }
};
const containsInvalidWords = async (data, invalidWords) => {
  function checkString(string) {
    return invalidWords.filter((word) => string.includes(word));
  }

  // Sử dụng Set để lưu trữ các từ ngữ không hợp lệ, tránh trùng lặp
  let invalidFoundSet = new Set();

  // Kiểm tra các trường trong đối tượng test
  for (const key in data.test) {
    const value = data.test[key];
    if (typeof value === "string") {
      const foundWords = checkString(value);
      foundWords.forEach((word) => invalidFoundSet.add(word));
    }
  }

  // Kiểm tra các câu hỏi trong questionList
  for (const question of data.questionList) {
    for (const key in question) {
      const value = question[key];
      if (typeof value === "string") {
        const foundWords = checkString(value);
        foundWords.forEach((word) => invalidFoundSet.add(word));
      }
    }
  }

  // Chuyển Set trở lại thành mảng
  return Array.from(invalidFoundSet);
};

const invalidWords = ["phản động", "hehe", "câu xyz", "khiêu dâm", "giết"];

const postTestHandler = async (req, res) => {
  var reqBody = req.body;

  var test = reqBody.metadata;
  var questionList = reqBody.data;

  var status = await createNewTest(test, questionList);
  if (status) {
    res.status(200).json({
      code: 1,
      error: 200,
      message: "Tạo bài thi thành công!",
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Tạo bài thi thất bại!",
    });
  }
};

const postTestHandler2 = async (req, res) => {
  var reqBody = req.body;

  var test = reqBody.metadata;

  var status = await createNewTest2(test);
  if (status) {
    res.status(200).json({
      mabaithi: status,
      code: 1,
      error: 200,
      message: "Tạo bài thi thành công!",
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Tạo bài thi thất bại!",
    });
  }
};

const postQuestionHandler = async (req, res) => {
  var reqBody = req.body;
  console.log(reqBody);
  var test = reqBody.question;
  let mbt = reqBody.mbt;
  console.log("test: ", test);
  var status = await createNewQuestion(test, mbt);
  if (status != false) {
    res.status(200).json({
      code: 1,
      error: 200,
      message: "Tạo câu hỏi thành công!",
      index: status,
    });
  } else {
    console.log("buc vcl");
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Tạo câu hỏi thất bại!",
    });
  }
};

const putQuestionHandler = async (req, res) => {
  var testId = req.params.id;
  var questionId = req.params.idQuestion;
  var updateData = req.body;

  var status = await updateQuestionById(testId, questionId, updateData);
  if (status) {
    res.status(200).json({
      code: 1,
      error: 200,
      message: "Cập nhật thành công!",
    });
  } else {
    res.status(500).json({
      code: 0,
      message: "Cập nhật thất bại!",
    });
  }
};

const deleteTestHandler = async (req, res) => {
  var testId = req.params.id;
  var status = await deleteTestById(testId);
  if (status) {
    res.status(200).json({
      code: 1,
      status: 200,
      message: "Xóa thành công!",
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Xóa thất bại!",
    });
  }
};

const updateTestHandler = async (req, res) => {
  var testId = req.params.id;
  var updateData = req.body;

  var status = await updateTestById(testId, updateData);
  if (status) {
    res.status(200).json({
      code: 1,
      error: 200,
      message: "Cập nhật thành công!",
    });
  } else {
    res.status(500).json({
      code: 0,
      message: "Cập nhật thất bại!",
    });
  }
};

const searchTestHandler = async (req, res) => {
  var name = req.query.text;
  var tests = await searchTestByName(name);
  if (tests.status === 200) {
    const response = {
      code: 1,
      status: 200,
      message: "successfully",
      data: tests.data,
    };

    res.status(200).json(response);
  } else if (tests.status === 404) {
    const response = {
      code: 0,
      status: 404,
      message: "Không tìm thấy bài thi",
    };

    res.status(404).json(response);
  } else if (tests.status === 500) {
    const response = {
      code: 0,
      status: 500,
      message: "Lỗi tìm kiếm",
    };

    res.status(500).json(response);
  }
};

const getTestWithStudent = async (req, res) => {
  const id = req.params.id;
  const data = { status: null, stuInfor: null, testList: null };
  const dataTest = await getTestByStudentId(id);
  data.status = dataTest.status;
  data.testList = dataTest.data;
  const stuInfor = await getStudentById(id);
  data.stuInfor = stuInfor.data;
  res.json(data);
};

const postSubmit = async (req, res) => {
  let msv = req.jwtDecoded.data.id;
  var reqBody = req.body;
  var test = reqBody.metadata;
  var questionList = reqBody.dataoption;

  var result = await createNewResult(msv, test[0], questionList);
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

module.exports = {
  getTestList,
  getQuestionByTestHandler,
  postTestHandler,
  postTestHandler2,
  postQuestionHandler,
  putQuestionHandler,
  deleteTestHandler,
  updateTestHandler,
  searchTestHandler,
  getTestWithStudent,
  getResultList,
  getDetailList,
  postTestHandler,
  getQuestionHandlernoAns,
  postSubmit,
  getTestByPage,
  getSearchTest,
  getProbByPage,
  getTestByIdHandler,
};
