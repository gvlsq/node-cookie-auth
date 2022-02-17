const path = require("path");

module.exports = function(err, req, res, next) {
  res.internalServerError(err.message);
}
