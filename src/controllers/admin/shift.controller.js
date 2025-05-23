const { Sequelize } = require("sequelize");

const {
  getCountShiftWithFindObject,
  updateShiftById,
  createNewShiftById,
  getShiftById,
  deleteShiftById,
} = require("../../services/shift.service");

const { studentListShiftService } = require("../../services/student.service");

const { getAllTest } = require("../../services/test.service");

const paginationHelper = require("../../helpers/paginationHelper");
const { Op } = require("sequelize");

const shiftListPaginate = async (req, res) => {
  const find = {};
  if (req.query.keyword) {
    const keyword = req.query.keyword.toLowerCase(); // Chuyển từ khóa về chữ thường
    const likeCondition = `%${keyword}%`; // Điều kiện tìm kiếm có chứa từ khóa
    find["$Test.TenBaiThi$"] = {
      [Op.like]: likeCondition,
    };
  }
  const limit = 5;
  const count = await getCountShiftWithFindObject(find); // tim doi tuong voi dieu kien find
  const pagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: limit,
    },
    req.query,
    count.data ? count.data.length : 0
  );

  //limit data để phân trang

  var data = [];
  if (count.data != null) {
    var page = req.query.page || 1;
    var index = 0;
    for (var i = (page - 1) * limit; i < page * limit; i++) {
      if (count.data[i]) {
        data[index] = count.data[i];
        index += 1;
      }
    }
  }
  if (data != null) {
    for (var i = 0; i < data.length; i++) {
      var startTime = new Date(data[i].start);
      var endTime = new Date(data[i].end);
      startTime.setHours(startTime.getHours());
      endTime.setHours(endTime.getHours());
      data[i].start = formatDateTime(startTime);
      data[i].end = formatDateTime(endTime);
    }
  }
  res.render("admin/pages/viewTest/viewShift.pug", {
    titlePage: "Danh sách ca thực hành",
    className: "Tất cả",
    shifts: data,
    pagination: pagination,
    keyword: req.query.keyword || "",
  });
};

const createNewShift = async (req, res) => {
  const tests = await getAllTest();

  res.render("admin/pages/viewTest/createShift.pug", {
    tests: tests.data,
    titlePage: "Tạo ca thực hành",
  });
};

const editShift = async (req, res) => {
  const id = req.params.id;

  const tests = await getAllTest();
  var shift = await getShiftById(id);

  var startTime = new Date(shift.data.start);
  var endTime = new Date(shift.data.end);

  startTime.setHours(startTime.getHours());
  endTime.setHours(endTime.getHours());

  shift.data.start = formatDateTime(startTime);
  shift.data.end = formatDateTime(endTime);

  var test;

  for (var i = 0; i < tests.data.length; i++) {
    if (tests.data[i].MaBaiThi == shift.data.MaBaiThi) {
      test = tests.data[i];
    }
  }

  res.render("admin/pages/viewTest/editShift.pug", {
    titlePage: "Chỉnh sửa ca thi",
    shift: shift.data,
    test: test,
    tests: tests.data,
  });
};

const updateShift = async (req, res) => {
  const { MaCaThi, MaBaiThi, start, end } = req.body;

  const data = {
    MaCaThi: MaCaThi,
    MaBaiThi: MaBaiThi,
    start: start,
    end: end,
  };

  const result = await updateShiftById(data);

  if (result.status === 200) {
    res.status(200).json({
      code: 1,
      status: 200,
      message: "Cập nhật thành công",
      data: result.data,
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Có lỗi xảy ra",
    });
  }
};

function formatDateTime(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDateTimeForInput(dateTime) {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const createShift = async (req, res) => {
  const { MaBaiThi, start, end } = req.body;

  const data = {
    MaBaiThi: MaBaiThi,
    start: start,
    end: end,
  };

  const result = await createNewShiftById(data);

  if (result.status === 200) {
    res.status(200).json({
      code: 1,
      status: 200,
      message: "Tạo ca thi thành công",
      data: result.data,
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Có lỗi xảy ra",
    });
  }
};

const deleteShift = async (req, res) => {
  const id = parseInt(req.body.id, 10);
  const deleteShift = await deleteShiftById(id);
  if (deleteShift.status === 200) {
    res.status(200).json({
      code: 1,
      status: 200,
      message: "Xóa thành công",
    });
  } else {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Có lỗi xảy ra",
    });
  }

  // nhớ là cần trả về res cho front end
};

const createNewStudentListShift = async (req, res) => {
  console.log(req.body);
  const students = req.body.accList;
  const macathi = parseInt(req.body.macathi);

  var status = await studentListShiftService(students, macathi);
  if (status == 1) {
    res.status(200).json({
      code: 1,
      status: 200,
      message: "Tạo sinh viên thành công!",
    });
  } else if (status == 0) {
    res.status(500).json({
      code: 0,
      status: 500,
      message: "Tạo sinh viên thất bại!",
    });
  }
};

module.exports = {
  shiftListPaginate,
  createNewShift,
  createNewStudentListShift,
  editShift,
  updateShift,
  createShift,
  deleteShift,
};
