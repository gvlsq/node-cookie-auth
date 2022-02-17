const express = require("express");

const {
  querySingle
} = require("../db/db");

const actionBase = require("../middleware/actionBase");
const {
  ensureAuth,
  ensureGuest,
} = require("../middleware/auth");

const router = express.Router();

router.get("/", ensureGuest, actionBase(function(req, res, next) {
  res.render("landing");
}));

router.get("/home", ensureAuth, actionBase(function(req, res, next) {
  querySingle(`SELECT USERNAME AS username
               FROM   USER
               WHERE  ID = ?;`, [req.session.userID], function(err, row) {
    res.render("home", {
      username: row.username,
      successMessage: req.flash("successMessage"),
    });
  });
}));

module.exports = router;
