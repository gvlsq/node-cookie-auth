const {
  compare
} = require("bcrypt");
const express = require("express");

const {
  query,
  querySingle
} = require("../db/db");

const actionBase = require("../middleware/actionBase");
const {
  ensureAuth,
  ensureGuest
} = require("../middleware/auth");

const router = express.Router();

router.get("/login", ensureGuest, actionBase(function(req, res, next) {
  res.render("login", {
    errorMessage: req.flash("errorMessage")
  });
}));

router.post("/login", ensureGuest, actionBase(function(req, res, next) {
  let error;

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    req.flash("errorMessage", "Please enter all fields");
    res.redirect("/login");
    return;
  }

  querySingle(`SELECT ID,
                      PASSWORD AS password
               FROM   USER
               WHERE  USERNAME = ?;`, [username], function(err, user) {
    if (err) throw err;

    if (!user) {
      req.flash("errorMessage", "Incorrect username or password");
      res.redirect("/login");
      return;
    }

    compare(password, user.password, function(err, same) {
      if (err) throw err;
      
      if (!same) {
        req.flash("errorMessage", "Incorrect username or password");
        res.redirect("/login");
        return;
      }
      
      req.session.userID = user.ID;
      req.session.createdAt = Date.now();
      
      res.redirect("/home");
    });
  });
}));

router.get("/logout", ensureAuth, actionBase(function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) throw err;

    res.clearCookie(process.env.COOKIE_NAME || "sid");
    res.redirect("/");
  });
}));

module.exports = router;
