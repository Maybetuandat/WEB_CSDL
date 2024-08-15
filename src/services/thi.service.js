const db = require("../models/index");
const { sequelize } = require("../config/connectDB");
const { createNewQuestion } = require("./question.service");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");
require("dotenv").config();
var request = require("request");
const { test } = require("../controllers/user/result/result.controller");

const getThiResult = async (msv, mbt, time, dscau) => {
  var data = { status: null, data: null };
  try {
    let result = await db.ResultTest.findOne({
      where: {
        MSV: msv,
        MaBaiThi: mbt,
      },
      raw: true,
    });
    //console.log(tests);
    if (result != null) {
      data.status = 200;
      data.data = result;
    } else {
      result = await db.ResultTest.create({
        MSV: msv,
        MaBaiThi: mbt,
        ThoiGianLamBai: time,
        DanhSachCau: dscau,
      });
      data.status = 200;
      data.data = result;
    }
    return data;
  } catch (error) {
    console.log(error);
    data.status = 500;
    return data;
  }
};

const getResultThiStuTest = async (msv, mbt) => {
  let tmp = await db.ResultTest.findOne({
    where: {
      MSV: msv,
      MaBaiThi: mbt,
    },
    attributes: ["ThoiGianLamBai", "ThoiGianNopBai"],
  });
  return tmp;
};

const updateDetail = async (msv, test, ans) => {
  let result = null;
  // let finish = new Date(test.finish.replace(" ", "T"));
  // finish = new Date(finish.getTime() + 7 * 60 * 60 * 1000);
  const currentTime = new Date();
  const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000);
  try {
    let tmp = await getResultThiStuTest(msv, test.mabaithi);
    if (tmp.ThoiGianNopBai == null) {
      result = await db.ResultTest.update(
        {
          ChiTiet: ans,
          ThoiGianNopBai: updatedTime,
        },
        {
          where: {
            MSV: msv,
            MaBaiThi: test.mabaithi,
          },
        }
      );
    }

    return result;
  } catch (error) {
    console.log(error);
    return result;
  }
};

module.exports = {
  getThiResult,
  getResultThiStuTest,
  updateDetail,
};
