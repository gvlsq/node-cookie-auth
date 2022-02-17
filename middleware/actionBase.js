module.exports = function(action) {
  const curried = function (req, res, next) {
    try {
      Promise.resolve(action(req, res, next));
    } catch (error) {
      next(error);
    }
  }

  return curried;
}
