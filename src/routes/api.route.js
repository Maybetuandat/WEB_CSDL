const express = require("express");
const router = express.Router();

const { checkLoginUser } = require("../controllers/auth.controllers");

const {
  getTestList,
  getTestByPage,
  getQuestionByTestHandler,
  postTestHandler,
  postTestHandler2,
  postQuestionHandler,
  deleteTestHandler,
  getTestByIdHandler,
  updateTestHandler,
  getTestWithStudent,
  searchTestHandler,
  getQuestionHandlernoAns,
  getResultList,
  getDetailList,
  postSubmit,
  getSearchTest,
} = require("../controllers/test.controllers");
const {
  getStudentHandler,
  getStudentByIdHandler,
  postStudentHandler,
  deleteStudentHandler,
  updateStudentHandler,
  updateStudentHandler2,
  getStudentInresultHandler,
  createNewStudentHandler,
  getStudentByPage,
  createNewStudentList,
} = require("../controllers/student.controllers");

const {
  getAllResultHandler,
  getDetailTestWithIdStuAndIdTest,
  getAllStaticWithDate,
  getAllStaticWithIdResult,
} = require("../controllers/result.controllers");

const {
  getStatisticsHandler,
} = require("../controllers/statistic.controllers");
const { isAuth, isAdmin } = require("../middleware/auth.middleware");
const { codeSubmit } = require("../controllers/code.controller");

const {
  saveMessageHandler,
  getMessageByRoomIdHandler,
  getMessageRoom,
} = require("../controllers/message.controller");
const {
  addCommentHandler,
  getCommentsHandler,
  getReplyCommentHandler,
} = require("../controllers/comment.controller");

//Guest

const increaseTimeout = (req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
};

router.post("/login/:role", checkLoginUser);
router.post("/createNewstudent", createNewStudentHandler);
router.post("/new-test", isAdmin, increaseTimeout, postTestHandler);
router.post("/new-test2", isAdmin, postTestHandler2);
router.post("/new-question", isAdmin, postQuestionHandler);
router.delete("/delete-test/:id", isAdmin, deleteTestHandler);
router.post("/new-student", postStudentHandler);
router.post("/new-student-list", createNewStudentList);
router.delete("/delete-student/:id", isAdmin, deleteStudentHandler);
router.put("/update-test/:id", isAdmin, updateTestHandler);
router.get("/get-student/:id", getStudentByIdHandler);
router.put("/update-student/:id", isAdmin, updateStudentHandler);
router.put("/update-profile-student/:id", isAuth, updateStudentHandler2);

//User

//Comment

//hiep
router.get("/thi/:id", isAuth, getQuestionHandlernoAns);
router.get("/result-list/:msv", isAuth, getResultList);
router.get("/result-list/:msv/:mkq", isAuth, getDetailList);

router.post("/khocvl", isAuth, codeSubmit);
router.get("/search-test", isAuth, getSearchTest);

//Admin
//vu1
router.get("/get-test", isAuth, getTestList);
router.get("/get-test-per-page", isAuth, getTestByPage);
router.get("/get-test/:id", isAuth, getQuestionByTestHandler);
router.get("/search-test", isAuth, searchTestHandler);
router.get("/get-detail-test/:id", isAuth, getTestByIdHandler);

router.put("/update-test/:id", isAdmin, updateTestHandler);

//vu2
router.get("/get-student", isAdmin, getStudentHandler);

router.get("/get-student-per-page", isAdmin, getStudentByPage);

//vu3
router.get("/statistics/:id", isAdmin, getStatisticsHandler);

//quan
router.get("/result/get-all-student", isAdmin, getStudentInresultHandler);
router.get("/result/get-all-student/:id", isAdmin, getStudentByIdHandler);
router.get("/result/detail/:id", isAdmin, getTestWithStudent);
router.get(
  "/result/detail/:id/:idTest",
  isAdmin,
  getDetailTestWithIdStuAndIdTest
);

//dat
router.get("/getAllStatic", isAdmin, getAllResultHandler);
router.get("/getAllStaticWithIdResult/:id", isAdmin, getAllStaticWithIdResult);
// router.get("/getAllStaticWithDate/:date", isAdmin, getAllStaticWithDate);

//loc ket qua theo ki thi va ngay thang
// router.get("/admin/get", getAllStaticHandler);

module.exports = router;
