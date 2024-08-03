// const { param } = require('../../../../routes/api.route');
const {
    getCountShiftWithFindObject,
    getShiftWithFindObject,
    getShiftById,
    getAllShift,
    updateShiftById,
    createNewShiftById

} = require("../../services/shift.service");

const { getTestById, getAllTest } = require("../../services/test.service");
// const { getQuestionOfTest } = require('../../../routes/api.route');
const paginationHelper = require("../../helpers/paginationHelper");
const { Op } = require("sequelize");


const shiftListPaginate = async (req, res) => {
    const find = {};
    const ten = req.query.name;
    if (ten) {
        find.Ten = ten;
    }

    if (req.query.keyword) {
        const regexExpression = new RegExp(req.query.keyword, "i").source;
        find[Op.or] = [
            { TenBaithi: { [Op.regexp]: regexExpression } },
            { MaBaiThi: { [Op.regexp]: regexExpression } },
        ];
    }
    // //console.log(find);
    const count = await getCountShiftWithFindObject(find);
    const pagination = paginationHelper(
        {
            currentPage: 1,
            limitedItem: 5,
        },
        req.query,
        count.data ? count.data.length : 0
    );
    const shiftList = await getShiftWithFindObject(find, pagination);

    var data = shiftList.data;


    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            var startTime = new Date(data[i].start)
            var endTime = new Date(data[i].end)
            // date.setHours(date.getHours() + 7);
            startTime.setHours(date.getHours() + 7)
            endTime.setHours(date.getHours() + 7)
            data[i].start = formatDateTime(startTime)
            data[i].end = formatDateTime(endTime)
        }
    }

    var tests = []

    if (data != null) {
        for (var i = 0; i < data.length; i++) {

            var test = await getTestById(data[i].MaBaiThi)
            tests.push(test.data[0])
            // console.log(test.data[0])
        }
    }

    res.render("admin/pages/viewTest/viewShift.pug", {
        titlePage: "Danh sách ca thực hành",
        className: ten || "Tất cả",
        shifts: data,
        tests: tests,
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


    var test;

    for (var i = 0; i < tests.data.length; i++) {
        if (tests.data[i].MaBaiThi == shift.MaBaiThi) {
            test = tests.data[i];
        }
    }


    res.render("admin/pages/viewTest/editShift.pug", {
        titlePage: "Chỉnh sửa ca thi",
        shift: shift.data,
        test: test,
        tests: tests.data
    });
};



const updateShift = async (req, res) => {
    const { MaCaThi, MaBaiThi, start, end } = req.body;

    const data = {
        MaCaThi: MaCaThi,
        MaBaiThi: MaBaiThi,
        start: start,
        end: end
    };

    console.log(data)

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
}


function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const createShift = async (req, res) => {
    const { MaBaiThi, start, end } = req.body;

    const data = {
        MaBaiThi: MaBaiThi,
        start: start,
        end: end
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
}

module.exports = {
    shiftListPaginate,
    createNewShift,
    editShift,
    updateShift,
    createShift
}
