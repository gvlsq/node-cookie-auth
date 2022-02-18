module.exports = function(err, req, res, next) {
  const statusCode = 500;
  res.status(statusCode).render("error", {
    statusCode: statusCode,
    errorMessage: "The server encountered an error"
  });
}
