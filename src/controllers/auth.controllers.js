require("dotenv").config();
const jwtHelper = require("../helpers/jwt.helper");
const {
  getStudentById,
  getStudentByIdForLogin,
} = require("../services/student.service");
const testServices = require("../services/test.service");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { insertJwt } = require("../services/student.service");
let tokenList = {};

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "24h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

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
  //check valid user and password
  if (!req.body.msv || !req.body.password) {
    const response = {
      code: 0,
      status: 400,
      message: "Yêu cầu điền thông tin đầy đủ",
    };

    res.render("user/login.pug", {
      data: response,
    });
  } else {
    // check database
    let data = await getStudentByIdForLogin(req.body.msv);
    //status = 200 -> tim thay sinh vien -> check password
    //status = 404 -> khong tim thay sinh vien -> response failed to login
    //status = 500 -> lỗi trong quá trình xử lý
    if (data.status === 404) {
      const response = {
        code: 0,
        status: 404,
        message: "Đăng nhập thất bại",
      };
      res.render("user/login.pug", {
        data: response,
      });
    } else if (data.status === 500) {
      const response = {
        code: 0,
        status: 500,
        message: "Đăng nhập thất bại",
      };
      res.render("user/login.pug", {
        data: response,
      });
    } else if (data.status === 200) {
      var ok = await bcrypt.compare(req.body.password, data.data.MatKhau);
      let response = {};
      if (ok) {
        const userData = {
          id: req.body.msv,
          role: req.params.role,
          email: data.data.email,
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

        // insert jwt to database
        const dataInsertjwt = {
          msv: req.body.msv,
          accessToken: data.accessToken,
        };
        await insertJwt(dataInsertjwt);

        return res.redirect("/");
      } else {
        response = {
          code: 0,
          status: 404,
          title: "Đăng nhập thất bại",
          message: "Thông tin tài khoản hoặc mật khẩu không chính xác",
        };
        res.render("user/login.pug", {
          data: response,
        });
        // res.status(404).json(response);
      }
    }
  }
};

const createTokenResponse = async (userData) => {
  const accessToken = await jwtHelper.generateToken(
    userData,
    accessTokenSecret,
    accessTokenLife
  );
  // const refreshToken = await jwtHelper.generateToken(
  //   userData,
  //   refreshTokenSecret,
  //   refreshTokenLife
  // );

  // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
  // tokenList[refreshToken] = { accessToken, refreshToken };
  const refreshToken = "";
  return { accessToken, refreshToken };
};

module.exports = {
  refreshToken,
  checkLoginUser,
  createTokenResponse,
};
