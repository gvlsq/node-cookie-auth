const dotenv = require("dotenv");
const flash = require("connect-flash");
const express = require("express");
const {
  engine
} = require("express-handlebars");
const session = require("express-session");
const morganBody = require("morgan-body");

const {
  createSessionStore,
  initDatabase
} = require("./db/db");

dotenv.config();

// Request pipeline
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));

app.use(session({
  cookie: {
    maxAge: 12*60*60*1000, // 12-hour idle timeout
    sameSite: true,
    secure: process.env.NODE_ENV === "production"
  },
  name: process.env.COOKIE_NAME || "sid",
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: "!anyone1learned909",
  store: createSessionStore()
}));
app.use(flash());

app.use(express.urlencoded({
  extended: true
}));
if (process.env.NODE_ENV !== "test") {
  morganBody(app, {
    timezone: "Etc/UTC",
    logAllReqHeader: true
  });
}

app.use(require("./middleware/responseHelpers"));
app.use(require("./middleware/auth").ensureActive);
app.use(require("./routes/index"));
app.use(require("./routes/auth"));
app.use(require("./routes/register"));
app.use(require("./middleware/exceptionHandler"));

initDatabase((err) => {
  if (err) throw err;

  console.log("Web server connected to the database");

  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, function() {
    console.log(`Web server started listening in ${NODE_ENV} on port ${PORT}`);
  });
});

module.exports = app;
