const db = require("../models/index");
const { sequelize } = require("../config/connectDB");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");
require("dotenv").config();
var request = require("request");

const getCountShiftWithFindObject = async (find) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Shift.findAll({
      raw: true,
      where: find,
      include: [
        {
          model: db.Test,
          as: "Test",
          required: true,
        },
      ],
      order: [["MaCaThi", "DESC"]],
    });
    if (tests.length > 0) {
      data.status = 200;
      data.data = tests;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

// const getShiftWithFindObject = async (find, pagination) => {
//   const data = { status: null, data: null };

//   try {
//     const shifts = await db.Shift.findAll({
//       where: find,
//       limit: pagination.limitedItem,
//       offset: pagination.limitedItem * (pagination.currentPage - 1),
//       raw: true,
//       include: [
//         {
//           model: db.Test,
//           attributes: [],
//         },
//       ],
//     });
//     if (shifts.length > 0) {
//       data.status = 200;
//       data.data = shifts;
//     } else {
//       data.status = 404;
//     }
//     return data;
//   } catch (error) {
//     console.error("Lỗi khi truy vấn dữ liệu:", error);
//     data.status = 500;
//     return data;
//   }
// };

const getShiftById = async (id) => {
  const data = { status: null, data: null };
  try {
    const shift = await db.Shift.findOne({
      where: { MaCaThi: id },
      raw: true,
    });
    if (shift) {
      data.status = 200;
      data.data = shift;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

const getAllShift = async () => {
  const data = { status: null, data: null };
  try {
    const shifts = await db.Shift.findAll({
      raw: true,
    });
    if (shifts.length > 0) {
      data.status = 200;
      data.data = shifts;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};

const updateShiftById = async (data) => {
  const dataRes = { status: null };
  try {
    const shift = await db.Shift.update(data, {
      where: {
        MaCaThi: data.MaCaThi,
      },
    });
    if (shift) {
      dataRes.status = 200;
    } else {
      dataRes.status = 404;
    }
    return dataRes;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    dataRes.status = 500;
    return dataRes;
  }
};

const createNewShiftById = async (data) => {
  const dataRes = { status: null };
  try {
    const shift = await db.Shift.create(data);
    if (shift) {
      dataRes.status = 200;
    } else {
      dataRes.status = 404;
    }
    return dataRes;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    dataRes.status = 500;
    return dataRes;
  }
};
const deleteShiftById = async (id) => {
  const data = { status: null };
  try {
    const shift = await db.Shift.destroy({
      where: {
        MaCaThi: id,
      },
    });
    if (shift) {
      data.status = 200;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    data.status = 500;
    return data;
  }
};
module.exports = {
  getCountShiftWithFindObject,
  deleteShiftById,
  getShiftById,
  getAllShift,
  updateShiftById,
  createNewShiftById,
};
