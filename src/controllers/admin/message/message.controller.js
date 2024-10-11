const { getAllStudent } = require("../../../services/student.service");

const getMessage = async (req, res) => {
  var room = req.params.room;
  const students = await getAllStudent();
  res.render("admin/pages/message/message.pug", {
    room: room,
    students: students.data,
  });
};

module.exports = {
  getMessage,
};
