const {
  hash
} = require("bcrypt");
const express = require("express");

const {
  execute,
  querySingle
} = require("../db/db");

const actionBase = require("../middleware/actionBase");
const {
  ensureGuest
} = require("../middleware/auth");

const router = express.Router();

router.get("/register", ensureGuest, actionBase(function(req, res, next) {
  res.render("register", {
    errorMessage: req.flash("errorMessage")
  });
}));

router.post("/register", ensureGuest, actionBase(function(req, res, next) {
  let error;

  const username = req.body.username;
  const emailAddress = req.body.emailAddress;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  if (!username || !emailAddress || !password || !passwordConfirmation) {
    error = "Please enter all fields";
  } else if (password.length < 6) {
    error = "Password must be at least 6 characters long";
  } else if (password !== passwordConfirmation) {
    error = "Passwords do not match";
  }

  if (error) {
    req.flash("errorMessage", error);
    res.redirect("/register");
    return;
  }

  querySingle(`SELECT ID
               FROM   USER
               WHERE  USERNAME = ?
               OR     EMAIL_ADDRESS = ?;`, [username, emailAddress], function(err, user) {
    if (err) throw err;

    if (user) {
      req.flash("errorMessage", "Username or email address is already in use");
      res.redirect("/register");
      return;
    }

    // The hash returned by bcrypt actually has the salt prepended to it, followed
    // by a period.
    const workFactor = 12;
    hash(password, workFactor, function(err, hashedPassword) {
      if (err) throw err;

      execute(`INSERT INTO
                 USER (USERNAME, EMAIL_ADDRESS, PASSWORD)
               VALUES
                 (?, ?, ?);`, [username, emailAddress, hashedPassword], function(err, lastID) {
        if (err) throw err;

        req.session.userID = lastID;
        req.session.createdAt = Date.now();

        req.flash("successMessage", "You are now registered!");
        res.redirect("/home");
      });
    });
  });
}));

module.exports = router;
