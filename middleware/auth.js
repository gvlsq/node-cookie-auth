const actionBase = require("./actionBase");

exports.ensureActive = actionBase(function(req, res, next) {
  if (req.session.userID) {
    const now = Date.now();
    const createdAt = req.session.createdAt;

    if (now >= createdAt + 5*24*60*60*1000) { // Absolute timeout of five days
      req.session.destroy(function(err) {
        if (err) throw err;

        req.flash("errorMessage", "Session expired");
        res.redirect("/login");
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

exports.ensureAuth = actionBase(function(req, res, next) {
  if (!req.session.userID) {
    res.redirect("/login");
    return;
  }

  next();
});

exports.ensureGuest = actionBase(function(req, res, next) {
  if (req.session.userID) {
    res.redirect("/home");
    return;
  }

  next();
});
