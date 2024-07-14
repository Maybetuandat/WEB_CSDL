const indexUser = require("./user");
const userListTest = require("./usertestlist.router");
const userResult = require("./viewResult.router");
const profileRoutes = require("./profile.router");
const detailTest = require("./detailTest.router")
const { isAuth } = require('../../middleware/auth.middleware')
const testListRoutes = require("./testList.router");

module.exports = (app) => {
  app.use("/", indexUser);
  app.use("/practice", isAuth, userListTest);
  app.use("/result", isAuth, userResult);
  app.use("/profile", isAuth, profileRoutes);
  app.use("/test", isAuth, testListRoutes);
  app.use("/detail", isAuth, detailTest)
};
