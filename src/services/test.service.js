const db = require("../models/index");
const { sequelize } = require("../config/connectDB");
const { createNewQuestion } = require("./question.service");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");
const moment2 = require("moment");
require("dotenv").config();
var request = require("request");

const getURL = async (idSubmit) => {
  let submit = await db.Submit.findAll({
    where: { MaSubmit: idSubmit },
  });
  return submit[0].dataValues.Source;
};

const getAllProbPerPage = async (page) => {
  var data = { status: null, data: null };
  try {
    const probs = await db.Problem.findAll({
      limit: 8,
      offset: (page - 1) * 8,
    });
    if (probs.length > 0) {
      data.status = 200;
      data.data = probs;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    data.status = 500;
    return data;
  }
};

const getAllTest = async () => {
  var data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({ raw: true });
    if (tests.length > 0) {
      data.status = 200;
      data.data = tests;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    data.status = 500;
    return data;
  }
};
const getAllThi = async () => {
  var data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      raw: true,
      where: {
        TrangThai: "th",
      },
    });
    if (tests.length > 0) {
      data.status = 200;
      data.data = tests;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    data.status = 500;
    return data;
  }
};

const getAllTestPerPage = async (page) => {
  var data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      limit: 10,
      offset: (page - 1) * 10,
    });
    if (tests.length > 0) {
      data.status = 200;
      data.data = tests;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    data.status = 500;
    return data;
  }
};

const getTestById = async (id) => {
  var data = { status: null, data: null };
  try {
    const test = await db.Test.findOne({ raw: true, where: { MaBaiThi: id } });
    console.log(test);
    if (test) {
      data.status = 200;
      data.data = test;
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

const getThiById = async (id) => {
  var data = { status: null, data: null };
  const currentTime = moment().tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate();
  try {
    const tests = await db.Test.findAll({
      raw: true,
      where: { MaBaiThi: id },
      include: [
        {
          model: db.Shift,
          required: true, // Đảm bảo chỉ lấy các bản ghi từ Test có mối quan hệ với Shift
          where: {
            start: {
              [Op.lte]: currentTime,
            },
            end: {
              [Op.gte]: currentTime,
            }, // Điều kiện lọc trên bảng Shift
          },
        },
      ],
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

const createNewTest = async (test, questionList) => {
  let t;
  try {
    // t = await sequelize.transaction();
    // var mbt = "BT111";

    // const formattedDate = moment2(test.examDateTime, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    var newTest = await db.Test.create(
      {
        // MaBaiThi: mbt,
        TenBaiThi: test.examName,
        ThoiGianBatDau: "2024-11-12 12:00:00",
        ThoiGianThi: parseInt(test.examTime),
        SoLuongCau: parseInt(questionList.length),
        TheLoai: test.examDescription,
        TrangThai: test.examStatus,
        img_url: test.imageUrl,
        TacGia: "B21DCCN343",
      }
      // { transaction: t }
    );

    var mbt = newTest.dataValues.MaBaiThi;

    var bulkQuestions = [];
    var bulkOptions = [];

    for (var i = 0; i < questionList.length; i++) {
      bulkQuestions.push({
        MaCauHoi: "C" + String(i + 1).padStart(2, "0"),
        MaBaiThi: mbt,
        DeBai: questionList[i].questionContent,
        SoThuTu: i + 1,
        TheLoai: "Trắc nghiệm",
      });

      for (var j = 1; j <= 4; j++) {
        var answerProperty = "answer" + j;
        var answerId = String.fromCharCode("A".charCodeAt(0) + j - 1);

        bulkOptions.push({
          MaCauHoi: "C" + String(i + 1).padStart(2, "0"),
          MaLuaChon: answerId,
          MaBaiThi: mbt,
          NoiDung: questionList[i][answerProperty],
          Dung: questionList[i]["check"] == j ? 1 : 0,
        });
      }
    }

    await db.Question.bulkCreate(bulkQuestions);
    await db.Option.bulkCreate(bulkOptions);

    // await db.Question.bulkCreate(bulkQuestions, { transaction: t });
    // await db.Option.bulkCreate(bulkOptions, { transaction: t });

    // for (var i = 0; i < questionList.length; i++) {
    //   await createNewQuestion(questionList[i], mbt, i + 1, t);
    // }
    // await t.commit();
    return true;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    // await t.rollback();
    return false;
  }
};

const createNewTest2 = async (test) => {
  console.log(test);
  try {
    var newTest = await db.Test.create({
      // MaBaiThi: mbt,
      TenBaiThi: test.examName,
      ThoiGianBatDau: "2024-11-12 12:00:00",
      ThoiGianThi: parseInt(test.examTime),
      SoLuongCau: test.numQuestions,
      TheLoai: test.examDescription,
      TrangThai: test.examStatus,
      img_url: test.imageUrl,
      TacGia: "B21DCCN343",
      used_schema: test.schemaRun,
      used_schema2: test.schemaTestcase,
    });

    var mbt = newTest.dataValues.MaBaiThi;

    return mbt;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    // await t.rollback();
    return null;
  }
};

const deleteTestById = async (testId) => {
  try {
    db.Test.destroy({
      where: {
        MaBaiThi: testId,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};

const updateTestById = async (testId, updateData) => {
  try {
    let updated = {
      TenBaiThi: updateData.metadata.examName,
      ThoiGianThi: parseInt(updateData.metadata.examTime),
      TheLoai: updateData.metadata.examDescription,
      TrangThai: updateData.metadata.examStatus,
    };

    await db.Test.update(updated, {
      where: {
        MaBaiThi: testId,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};
const searchTestByName = async (name) => {
  var data = { status: null, data: null };
  const { Op } = require("sequelize");
  try {
    const tests = await db.Test.findAll({
      where: {
        TenBaiThi: { [Op.like]: "%" + name.replace(/"/g, "") + "%" },
      },
    });

    if (tests.length > 0) {
      data.status = 200;
      data.data = tests;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    data.status = 500;
    return data;
  }
};
const getTestByStudentId = async (stuID) => {
  try {
    const data = { status: null, data: [] };
    const listTest = await db.Test.findAll({
      raw: true,
      include: {
        model: db.Result,
        where: {
          MSV: stuID,
        },
      },
    });
    if (listTest.length > 0) {
      data.status = 200;
      data.data = listTest;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

const getSubmitByStudentId = async (stuID) => {
  try {
    const data = { status: null, data: [] };
    const listSubmit = await db.Submit.findAll({
      raw: true,
      where: {
        MSV: stuID,
      },
    });
    if (listSubmit.length > 0) {
      data.status = 200;
      data.data = listSubmit;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

const getTestWithFindObject = async (find, pagination) => {
  const data = { status: null, data: null };

  try {
    const tests = await db.Test.findAll({
      where: find,
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      order: [["MaBaiThi", "DESC"]],
      raw: true,
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
const getTestWithFindObjectUser = async (find, msv, pagination) => {
  const data = { status: null, data: null };

  try {
    const tests = await db.Test.findAll({
      where: {
        ...find,
        TacGia: msv,
      },
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      raw: true,
      order: [["ThoiGianBatDau", "DESC"]],
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
const getIdTestWithDate = async (ngay) => {
  try {
    const listId = await db.Test.findAll({
      attributes: ["MaBaiThi"], // Chỉ lấy trường id
      raw: true,
      where: {
        ThoiGianBatDau: {
          [Sequelize.Op.like]: `%${ngay}%`,
        },
      },
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

const getCountTestWithFindObject = async (find) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      raw: true,
      where: find,
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
    return listId;
  }
};

const getCountTestWithFindObjectUser = async (find, msv) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      raw: true,
      where: {
        ...find,
        TacGia: msv,
      },
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
    return listId;
  }
};

const getTestByText = async (inputText) => {
  try {
    const tests = await db.Test.findAll({
      where: {
        TenBaiThi: {
          [db.Sequelize.Op.like]: `%${inputText}%`,
        },
      },
    });
    return tests;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    return null;
  }
};

const getTestByStudentIdWithPage = async (stuID, pagination) => {
  try {
    const data = { status: null, data: [] };
    let listTest = await db.Test.findAll({
      raw: true,
      // limit: pagination.limitedItem,
      // offset: pagination.limitedItem * (pagination.currentPage - 1),
      include: {
        model: db.Result,
        where: {
          MSV: stuID,
        },
      },
      order: [[db.Result, "ThoiGianNopBai", "DESC"]], // Sắp xếp theo trường ThoiGianNopBai trong bảng Result theo thứ tự giảm dần
    });

    let start = pagination.limitedItem * (pagination.currentPage - 1);
    newlist = listTest.slice(start, start + 5);
    for (let i = 0; i < newlist.length; i++) {
      if (newlist[i].start != null) {
        newlist[i]["Results.Diem"] = null;
      }
    }
    if (listTest.length > 0) {
      data.status = 200;
      data.data = newlist;
    } else {
      data.status = 404;
    }
    return data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

const getSubmitByStudentIdWithPage = async (stuID, pagination) => {
  try {
    let data = { status: null, data: [] };
    let listSubmit = await db.Submit.findAll({
      raw: true,
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      where: {
        MSV: stuID,
      },
      order: [["MaSubmit", "DESC"]],
    });

    let submissionsIds = listSubmit.map((submit) => submit.MaSubmit);
    var accessToken = process.env.TOKEN_PROBLEM;
    var endpoint = process.env.ENDPOINT_API;

    const requestData = await new Promise((resolve, reject) => {
      request(
        {
          url:
            "https://" +
            endpoint +
            "/api/v4/submissions?ids=" +
            submissionsIds.join() +
            "&access_token=" +
            accessToken,
          method: "GET",
        },
        (error, response, body) => {
          if (error) {
            reject("Connection problem");
            return;
          }
          // process response
          if (response && response.statusCode === 200) {
            const listSubmit = JSON.parse(response.body).items;
            data.status = 200;
            data.data = listSubmit;
          } else {
            if (response && response.statusCode === 401) {
            } else if (response && response.statusCode === 400) {
              const body = JSON.parse(response.body);
            }
            data.status = 404;
          }
          resolve(data);
        }
      );
    });
    requestData.data = requestData.data.reverse();
    return requestData;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

const getTestWithFindObjectAndPage = async (find, pagination) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      where: find,
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      raw: true,
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

const getThiWithFindObjectAndPage = async (find, pagination) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      where: {
        ...find,
        TrangThai: "th",
      },
      order: [["MaBaiThi", "DESC"]],
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      raw: true,
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

const getTestListForStudent = async () => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      where: {
        TrangThai: "Mở",
      },
      raw: true,
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
const getCountTestListForStudentWithFindObject = async (find) => {
  const data = { status: null, data: null };
  try {
    const tests = await db.Test.findAll({
      raw: true,
      where: {
        ...find,
        TrangThai: {
          [Sequelize.Op.ne]: "th",
        },
      },
      // order: [[db.Test, 'ThoiGianNopBai', 'DESC']],
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

const getTestListForStudentWithFindObject = async (find, pagination) => {
  const data = { status: null, data: null };
  const currentTime = moment().tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate();
  try {
    const tests = await db.Test.findAll({
      where: {
        ...find,
        TrangThai: {
          [Op.ne]: "th",
        },
        // [Op.or]: [
        //   {
        //     start: {
        //       [Op.lte]: currentTime,
        //     },
        //     end: {
        //       [Op.gte]: currentTime,
        //     },
        //   },
        //   {
        //     start: {
        //       [Op.eq]: null,
        //     },
        //     end: {
        //       [Op.eq]: null,
        //     },
        //   },
        // ],
      },
      limit: pagination.limitedItem,
      offset: pagination.limitedItem * (pagination.currentPage - 1),
      raw: true,
      order: [["ThoiGianBatDau", "DESC"]], // Đảm bảo sử dụng đúng tên cột
    });

    if (tests.length > 0) {
      // Lấy mã bài thi từ danh sách tests
      const testIds = tests.map((test) => test.MaBaiThi);

      // Tạo mảng các promises cho các truy vấn đếm
      const testCountPromises = testIds.map((testId) => {
        return db.Result.findOne({
          attributes: [
            "MaBaiThi",
            [sequelize.fn("COUNT", sequelize.col("MaBaiThi")), "count"],
          ],
          where: {
            MaBaiThi: testId,
          },
          raw: true,
        });
      });

      // Chờ cho tất cả các promises hoàn thành và lấy kết quả
      const testCounts = await Promise.all(testCountPromises);

      // Gộp kết quả đếm vào danh sách bài thi
      const testsWithCounts = tests.map((test) => {
        const countInfo = testCounts.find(
          (tc) => tc && tc.MaBaiThi === test.MaBaiThi
        );

        return {
          ...test,
          count: countInfo ? countInfo.count : 0,
        };
      });

      data.status = 200;
      data.data = testsWithCounts;
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

const getThiList = async (msv) => {
  const data = { status: null, data: null };
  const currentTime = moment().tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate();
  try {
    const tests = await db.Test.findAll({
      include: [
        {
          model: db.Shift,
          required: true, // Đảm bảo chỉ lấy các bản ghi từ Test có mối quan hệ với Shift
          where: {
            start: {
              [Op.lte]: currentTime,
            },
            end: {
              [Op.gte]: currentTime,
            }, // Điều kiện lọc trên bảng Shift
          },
          include: [
            {
              model: db.ListStudent,
              required: true,
              where: {
                MSV: msv,
              },
            },
          ],
        },
      ],
      where: {
        TrangThai: "th",
      },
      raw: true,
      // order: [["ThoiGianBatDau", "DESC"]], // Đảm bảo sử dụng đúng tên cột
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

module.exports = {
  getAllTest,
  getTestById,
  createNewTest,
  createNewTest2,
  deleteTestById,
  updateTestById,
  getTestByStudentId,
  searchTestByName,
  getAllTestPerPage,
  getCountTestWithFindObject,
  getTestWithFindObject,
  getTestByStudentIdWithPage,
  getTestWithFindObjectAndPage,
  getTestListForStudent,
  getCountTestListForStudentWithFindObject,
  getTestListForStudentWithFindObject,
  getAllProbPerPage,
  getSubmitByStudentIdWithPage,
  getSubmitByStudentId,
  getURL,
  getCountTestWithFindObjectUser,
  getTestWithFindObjectUser,
  getThiList,
  getThiById,
  getAllThi,
  getThiWithFindObjectAndPage,
};
