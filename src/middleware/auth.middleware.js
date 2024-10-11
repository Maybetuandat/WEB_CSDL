const { get } = require("request");
const jwtHelper = require("../helpers/jwt.helper");
const { getJwtFromDb } = require("../services/student.service");
require("dotenv").config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const isAuth = async (req, res, next) => {
  const tokenFromClient = req.cookies.jwt;
  if (!tokenFromClient) {
    return res.redirect("/login");
  }
  try {
    const decoded = await jwtHelper.verifyToken(
      tokenFromClient,
      accessTokenSecret
    );
    req.jwtDecoded = decoded;
    const getJwt = await getJwtFromDb(decoded.data.id);

    if (tokenFromClient !== getJwt) {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    return res.status(401).json({
      code: 0,
      status: 401,
      message: "User Unauthorized.",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const tokenFromClient = req.cookies.jwt;

  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );

      if (decoded.data.role === "1") {
        next();
      } else {
        return res.status(401).json({
          code: 0,
          status: 401,
          message: "Không có quyền admin",
        });
      }
    } catch (error) {
      return res.status(401).json({
        code: 0,
        status: 401,
        message: "Unauthorized.",
      });
    }
  } else {
    return res.status(403).json({
      code: 0,
      status: 403,
      message: "No token provided.",
    });
  }
};
module.exports = {
  isAuth,
  isAdmin,
};
