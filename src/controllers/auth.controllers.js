require("dotenv").config();
const jwtHelper = require("../helpers/jwt.helper");
const {
  getOtpWithEmail,
  createOtp,
  deleteOtp,
  updateOtp,
} = require("../services/otp.service");
const {
  getStudentById,
  createNewStudent,
  getStudentByEmail,
  updatePassword,
} = require("../services/student.service");
const sendMailTo = require("../middleware/sendEmail");
const testServices = require("../services/test.service");
const bcrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;
let tokenList = {};
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "24h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

//module dang nhap

const indexLogin = async (req, res) => {
  const response = req.session.response;
  delete req.session.response; // Xóa session response sau khi sử dụng
  res.render("user/login.pug", {
    //render trang khi moi dang nhap
    titlePage: "Thông tin cá nhân",
    data: response,
  });
};

const refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.body.refreshToken;
  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );

      const userFakeData = decoded.data;

      const accessToken = await jwtHelper.generateToken(
        userFakeData,
        accessTokenSecret,
        accessTokenLife
      );

      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        code: 0,
        status: 403,
        message: "Invalid refresh token.",
      });
    }
  } else {
    return res.status(403).send({
      code: 0,
      status: 403,
      message: "No token provided.",
    });
  }
};

const checkLoginUser = async (req, res) => {
  // //console.log(req.params.role)
  // if (req.params.role === 'user') {
  //check valid user and password
  if (!req.body.msv || !req.body.password) {
    req.session.response = {
      code: 0,
      status: 400,
      message: "Yêu cầu điền thông tin đầy đủ",
    };

    res.redirect("/");
  } else {
    // check database
    let data = await getStudentById(req.body.msv);
    //status = 200 -> tim thay sinh vien -> check password
    //status = 404 -> khong tim thay sinh vien -> response failed to login
    //status = 500 -> lỗi trong quá trình xử lý
    if (data.status === 404) {
      req.session.response = {
        code: 0,
        status: 404,
        message: "Đăng nhập thất bại",
      };
      res.redirect("/");
    }
    if (data.status === 500) {
      req.session.response = {
        code: 0,
        status: 500,
        message: "Đăng nhập thất bại",
      };
      res.redirect("/");
    }
    if (data.status === 200) {
      var ok = await bcrypt.compareSync(
        req.body.password,
        data.data[0].MatKhau
      );
      let response = {};
      if (ok) {
        console.log(data.data[0]);
        const userData = {
          id: req.body.msv,
          role: req.params.role,
          email: data.data[0].email,
        };

        data = await createTokenResponse(userData);

        response = {
          code: 1,
          status: 200,
          message: "Đăng nhập thành công",
          // data: data
        };
        res.cookie("jwt", data.accessToken, {
          maxAge: 86400000,
          httpOnly: true,
          SameSite: "None",
        });
        return res.redirect("/result");
      } else {
        req.session.response = {
          code: 0,
          status: 404,
          message: "Thông tin tài khoản hoặc mật khẩu không chính xác",
        };
        res.redirect("/");
        // res.status(404).json(response);
      }
    }
  }
};

const createTokenResponse = async (userData) => {
  // //console.log(userData);

  const accessToken = await jwtHelper.generateToken(
    userData,
    accessTokenSecret,
    accessTokenLife
  );
  const refreshToken = await jwtHelper.generateToken(
    userData,
    refreshTokenSecret,
    refreshTokenLife
  );

  // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
  tokenList[refreshToken] = { accessToken, refreshToken };

  return { accessToken, refreshToken };
};

//module dang ky
const indexRegister = async (req, res) => {
  // co 2 case: 1 la hien thi trang dang ky, 2 la hien thi trang dang ky thanh cong
  if (req.session.case == null) {
    res.render("user/register.pug");
    return;
  }
  let testcase = req.session.case;
  delete req.session.case;
  if (testcase == 0) {
    // xay ra truong hop dang ky that bai
    const response = req.session.response;
    delete req.session.response; // Xóa session response sau khi sử dụng
    res.render("user/register.pug", {
      //render trang khi moi dang nhap
      titlePage: "Đăng ký thất bại",
      data: response,
    });
  } else if (testcase == 1) {
    // xay ra truong hop dang ky thanh cong
    res.render("user/successRegister.pug", {
      titlePage: "Đăng ký thành công",
    });
  }
};
const createUser = async (req, res) => {
  let student = req.body;
  if (!req.body.msv || !req.body.password || !req.body.email) {
    req.session.response = {
      code: 0,
      status: 400,
      message: "Yêu cầu điền thông tin đầy đủ",
      title: "Đăng ký thất bại",
    };
    req.session.case = 0;

    res.redirect("/register");
    return;
  }
  var status = await createNewStudent(student);
  if (status === 1) {
    req.session.case = 1;
    res.redirect("/register");
  } else {
    req.session.case = 0;
    req.session.response = {
      code: 0,
      status: 404,
      message: "Sinh viên đã tồn tại",
      title: "Đăng ký thất bại",
    };
    res.redirect("/register");
  }
};
const indexForgotPassword = async (req, res) => {
  //testcase == null -> in ra giao dien forgot password
  // testcase == 0 -> email khong ton tai
  // testcase == 1 -> hien thi giao dien nhap otp va nhan message, neu khong co thi khong in ra
  // testcase == 2 -> hien thi giao dien nhap mat khau moi
  //test case == 3 -> hien thi giao dien doi mat khau thanh cong
  const testcase = req.session.case;
  delete req.session.case;
  if (testcase == null) {
    res.render("user/forgotPassword.pug");
    return;
  }
  const response = req.session.response;
  delete req.session.response; // Xóa session response sau khi sử dụng
  if (testcase == 0) {
    res.render("user/forgotPassword.pug", {
      //render trang khi moi dang nhap
      data: response,
    });
  }
  if (testcase == 1) {
    res.render("user/verifyOTP.pug", {
      data: response,
    });
  }
  if (testcase == 2) {
    res.render("user/resetPassword.pug", {
      data: response,
    });
  }
  if (testcase == 3) {
    res.render("user/successResetPassword.pug");
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Tạo số ngẫu nhiên từ 100000 đến 999999
}

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  req.session.email = email;
  let data = await getStudentByEmail(email);
  if (data.status != 200) {
    req.session.response = {
      message: "Email này chưa được đăng ký tài khoản, hãy đăng ký",
      title: "Thất bại",
    };
    req.session.case = 0;
    res.redirect("/forgotPassword");
  } else {
    const otp = generateOTP();
    await sendMailTo(email, otp);
    const data = await createOtp(
      email,
      new Date(),
      new Date().setMinutes(new Date().getMinutes() + 5),
      otp
    );
    if (data.status != 200)
      await updateOtp(
        email,
        new Date(),
        new Date().setMinutes(new Date().getMinutes() + 5),
        otp
      );
    req.session.case = 1;
    req.session.response = {
      title: "Thành công",
      message:
        "Mã OTP đã được gửi đến email của bạn, hãy nhớ mã  OTP này chỉ có hiệu lực trong vòng 5 phút",
    };
    res.redirect("/forgotPassword");
  }
};

const verifyOTP = async (req, res) => {
  let newotp = await (req.body.digit1 +
    req.body.digit2 +
    req.body.digit3 +
    req.body.digit4 +
    req.body.digit5 +
    req.body.digit6);

  // Lấy email và mã OTP đã lưu trữ
  const email = req.session.email;
  const data = await getOtpWithEmail(email);

  // không tìm thấy trong database hoặc lỗi -> thông báo mã otp đã hết hạn hãy gửi lại yêu cầu mã otp
  // sẽ làm một cái message gửi đến file  verify otp
  //nếu status = 200 -> so sánh với otp nhập vào xem có trùng khớp không
  // nếu trùng khớp -> render ra trang đổi mật khẩu
  // nếu không trùng khớp -> thông báo otp không hợp lệ bằng một message trong file verify otp
  if (data.status != 200) {
    // không tìm thấy trong database hoặc lỗi -> do quá hạn thời gian nên đã xóa ở dưới
    req.session.response = {
      message: "Mã OTP đã hết hạn, hãy gửi lại yêu cầu mã OTP",
      title: "Thất bại",
    };
    req.session.case = 1;
    res.redirect("/forgotPassword");
    return;
  }
  // Kiểm tra xem mã OTP được nhập có trùng khớp với mã OTP đã lưu trữ hay không

  if (data.data[0].end_time < new Date()) {
    await deleteOtp(email);
    req.session.response = {
      message: "Mã OTP đã hết hạn, hãy gửi lại yêu cầu mã OTP",
      title: "Thất bại",
    };
    req.session.case = 1;
    res.redirect("/forgotPassword");
    return;
  }

  const otp = data.data[0].otp_code;
  if (otp.toString() == newotp && data.data[0].end_time > new Date()) {
    await deleteOtp(email);
    req.session.case = 2;
    res.redirect("/forgotPassword");
  } else {
    req.session.response = {
      message: "OTP không hợp lệ, hãy thử lại",
      title: "Thất bại",
    };
    req.session.case = 1;
    res.redirect("/forgotPassword");
  }
};
const changePassword = async (req, res) => {
  // nhớ chỉnh email thành khóa chính
  const newPassword = req.body.newPassword;
  const email = req.session.email;
  const confirmPassword = req.body.confirmPassword;
  try {
    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp nhau không
    if (newPassword != confirmPassword) {
      req.session.response = {
        message: "Mật khẩu không trùng khớp, hãy thử lại",
        title: "Thất bại",
      };
      req.session.case = 2;
      res.redirect("/forgotPassword");
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới trong cơ sở dữ liệu
      await updatePassword(email, hashedPassword);
      req.session.case = 3;
      res.redirect("/forgotPassword");
    }
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thay đổi mật khẩu." });
  }
};

module.exports = {
  refreshToken,
  createTokenResponse,
  checkLoginUser: checkLoginUser,
  indexLogin: indexLogin,
  createUser: createUser,
  indexRegister: indexRegister,
  indexForgotPassword: indexForgotPassword,
  forgotPassword: forgotPassword,
  verifyOTP: verifyOTP,
  changePassword: changePassword,
};
