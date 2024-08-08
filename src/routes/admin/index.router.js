const viewResultRoutes = require("./viewResult.router");
const testListRoutes = require("./testList.router");
const accountManageRoutes = require("./account.router");
const profileRoutes = require("./profile.router");

const indexAdmin = require("./admin.login.router");
const statisticRouter = require("./statistic.router");
const permissionRouter = require("./permission.router");
const messageRouter = require("./message.router");
const dashboardRouter = require("./dashboard.router");
const errorRouter = require("./error.router");
const shiftRouter = require("./shift.router");
const { isAdmin } = require("../../middleware/auth.middleware");

// const { isAdminPermission } = require("../../middleware/auth.middleware");
module.exports = (app) => {
  app.use("/admin/result", isAdmin, viewResultRoutes);
  app.use("/admin/test", isAdmin, testListRoutes);
  app.use("/admin/account", isAdmin, accountManageRoutes);
  app.use("/admin/profile", isAdmin, profileRoutes);
  app.use("/admin/statistic", isAdmin, statisticRouter);
  app.use("/admin/permission", isAdmin, permissionRouter);
  app.use("/admin/message", isAdmin, messageRouter);
  app.use("/admin/error", errorRouter);
  app.use("/admin", indexAdmin);
  app.use("/admin/dashboard", isAdmin, dashboardRouter);
  app.use("/admin/shift", isAdmin, shiftRouter);
};
