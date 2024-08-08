require("dotenv").config();
const express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 9999;
const session = require("express-session");

const viewEngine = require("./src/config/viewEngine.config");
const mainRoutes = require("./src/routes/main.route");
const apiRoutes = require("./src/routes/api.route");

const adminRoutes = require("./src/routes/admin/index.router");
const userRoutes = require("./src/routes/user/index.router");
const errorRoutes = require("./src/routes/pageError/index.router");
const { connection } = require("./src/config/connectDB");

const bodyParserErrorHandler = require('express-body-parser-error-handler')

app.use(express.static("views/user/pages/test_list/problist"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParserErrorHandler());
// app.use(bodyParser.json());

app.set("views", `views`);
app.set("view engine", "pug");
//config req body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
// app.use(trimInputs)
app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
//express-session
app.use("/api", apiRoutes);
viewEngine(app);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

connection();

adminRoutes(app);
userRoutes(app);
errorRoutes(app);
mainRoutes(app);
