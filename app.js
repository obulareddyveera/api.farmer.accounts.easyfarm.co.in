var http = require("http");
var debug = require("debug")("api.farmer.accounts.easyfarm.co.in:server");
var createError = require("http-errors");
var express = require("express");
var cors = require('cors');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var oAuthRouter = require("./routes/oAuth");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
var allowedOrigins = [
  "http://localhost:3000",
  "http://farmer.accounts.easyfarm.co.in/",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
require("./dao/config/connection");
app.use("/", oAuthRouter);
app.use("/auth/users", usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});
/**
 * Create HTTP server.
 */

var http = require("http");
var server = http.createServer(app);
console.log("--== process.env.name ", process.env.name);
if (process.env.name) {
  console.log("--== APP is running on UnKnown PORT !!!! ==--");
  server.listen();
} else {
  console.log("--== APP is running on 3000 PORT !!!! ==--");
  server.listen(3000);
}
