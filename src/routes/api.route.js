const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { checkLoginUser } = require("../controllers/auth.controllers");
const {
  updateImageQuestion,
  updateImageOption,
} = require("../services/question.service");

const {
  getTestList,
  getTestByPage,
  getQuestionByTestHandler,
  postTestHandler,
  postTestHandler2,
  postQuestionHandler,
  putQuestionHandler,
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
  createNewStudentListShift,
} = require("../controllers/admin/shift.controller");
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

const uploadCloud = require("../config/cloudinary.config");
//Guest

const increaseTimeout = (req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
};

const uploadDir = path.join(__dirname, "../../images/test");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu file vào thư mục uploads/
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
});

// API tiếp nhận ảnh tải lên
router.post(
  "/upload-image",
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 }, // Định nghĩa trường "image"
  ]),
  (req, res) => {
    console.log(req.body); // Hiển thị giá trị mbt và mch
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.files.image[0].filename,
    });
  }
);

router.post("/upload-image2", uploadCloud.single("image"), (req, res) => {
  // 'image' là tên field trong form gửi ảnh lên
  console.log(req.body.mbt);
  console.log(req.body.mch);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Sau khi ảnh được upload lên Cloudinary, bạn có thể truy xuất URL ảnh từ `req.file.path`
  res.json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path, // Đây là URL ảnh mà Cloudinary trả về
  });
  console.log(req.file.path);
  if (req.body.mlc) {
    console.log("mlc: ", req.body.mlc);
    updateImageOption(req.file.path, req.body.mbt, req.body.mch, req.body.mlc);
  } else updateImageQuestion(req.file.path, req.body.mbt, req.body.mch);
});

router.post("/login/:role", checkLoginUser);
router.post("/createNewstudent", createNewStudentHandler);
router.post("/new-test", isAdmin, increaseTimeout, postTestHandler);
router.post("/new-test2", isAdmin, postTestHandler2);
router.post("/new-question", isAdmin, postQuestionHandler);
router.delete("/delete-test/:id", isAdmin, deleteTestHandler);
router.post("/new-student", postStudentHandler);
router.post("/new-student-list", createNewStudentList);
router.post("/new-student-list-cathi", createNewStudentListShift);
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
router.put("/update-test/:id/:idQuestion", isAdmin, putQuestionHandler);

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
