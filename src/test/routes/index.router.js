const queryRouter = require("./query.router");

module.exports = (app) => {
  app.use("/query", queryRouter);
};
