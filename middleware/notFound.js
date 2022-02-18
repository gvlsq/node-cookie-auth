module.exports = function(req, res, next) {
  const statusCode = 404;
  res.status(statusCode).render("error", {
  	statusCode: statusCode,
    errorMessage: "The requested URL could not be found"
  });
}
