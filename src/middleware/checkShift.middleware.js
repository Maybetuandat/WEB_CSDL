const db = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const {
  getShiftByTestId,
  checkStudentInList,
} = require("../services/shift.service");
const path = require("path");

const checkShift = async (req, res, next) => {
  const mbt = req.params.testId;
  const shift = await getShiftByTestId(mbt);
  if (!shift) {
    return res.status(404).json({
      code: 0,
      status: 404,
      message: "Không có ca thi nào",
    });
  }
  req.shift = shift;
  next();
};

const checkShiftForImage = async (req, res, next) => {
  const filename = path.basename(req.path);
  const mbt = filename.split("_")[0];
  const shift = await getShiftByTestId(mbt);
  if (!shift) {
    return res.status(404).json({
      code: 0,
      status: 404,
      message: "Không có ca thi nào",
    });
  }
  req.shift = shift;
  next();
};

const checkListStudent = async (req, res, next) => {
  const macathi = req.shift.MaCaThi;
  const msv = req.jwtDecoded.data.id;
  const listStudent = await checkStudentInList(macathi, msv);

  if (!listStudent) {
    return res.status(404).json({
      code: 0,
      status: 404,
      message: "Không có trong danh sách thi",
    });
  }
  // Nếu có, cho phép tiếp tục
  next();
};

module.exports = {
  checkShift,
  checkShiftForImage,
  checkListStudent,
};
