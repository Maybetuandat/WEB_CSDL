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
    data.status = 500;
    return data;
  }
};

const getSqlResult = async (msv, mbt) => {
  var data = { status: null, data: null };
  try {
    let result = await db.ResultSql.findAll({
      where: {
        MSV: msv,
        MaBaiThi: mbt,
      },
      raw: true,
    });

    data.status = 200;
    data.data = result;

    return data;
  } catch (error) {
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

const getResultSqlStuTest = async (msv, mbt, mch) => {
  let tmp = await db.ResultSql.findOne({
    where: {
      MSV: msv,
      MaBaiThi: mbt,
      Cau: mch,
    },
    attributes: ["ThoiGianNopBai"],
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
    return result;
  }
};

const updateDetailSql = async (msv, test) => {
  let result = null;
  // let finish = new Date(test.finish.replace(" ", "T"));
  // finish = new Date(finish.getTime() + 7 * 60 * 60 * 1000);
  const currentTime = new Date();
  const updatedTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000);
  try {
    let tmp = await getResultSqlStuTest(msv, test.mabaithi, test.macauhoi);
    if (tmp == null) {
      result = await db.ResultSql.create({
        MSV: msv,
        MaBaiThi: test.mabaithi,
        Cau: test.macauhoi,
        ThoiGianNopBai: updatedTime,
        ChiTiet: test.chitiet,
      });
    } else {
      result = await db.ResultSql.update(
        {
          ChiTiet: test.chitiet,
          ThoiGianNopBai: updatedTime,
        },
        {
          where: {
            MSV: msv,
            MaBaiThi: test.mabaithi,
            Cau: test.macauhoi,
          },
        }
      );
    }

    return result;
  } catch (error) {
    return result;
  }
};

module.exports = {
  getThiResult,
  getSqlResult,
  getResultThiStuTest,
  updateDetail,
  updateDetailSql,
};
