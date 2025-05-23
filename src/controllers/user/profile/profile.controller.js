const db = require("../../../models/index");
const jwtHelper = require("../../../helpers/jwt.helper");
const secretKey = process.env.ACCESS_TOKEN_SECRET;
module.exports.index = async (req, res) => {
  const token = req.cookies.jwt;
  const decoded = await jwtHelper.verifyToken(token, secretKey);

  let msv = decoded.data.id;

  const user = await db.Student.findAll({ where: { MSV: msv }, raw: true });

  res.render("user/pages/profile/index.pug", {
    titlePage: "Thông tin người dùng",
    admin: user[0],
  });
};
