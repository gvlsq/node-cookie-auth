module.exports = function(req, res, next) {
  let successResponse = {
    success: true,
    data: null
  };
  let failureResponse = {
    success: false,
    message: null
  };

  // 2XX
  res.ok = function(o) {
    successResponse.data = o;
    res.status(200).json(successResponse);
  }
  res.created = function(o) {
    successResponse.data = o;
    res.status(201).json(successResponse);
  }
  
  // 4XX
  res.badRequest = function(message) {
    failureResponse.message = message;
    res.status(400).json(failureResponse);
  }
  res.unauthorized = function(message) {
    failureResponse.message = message;
    res.status(401).json(failureResponse);
  }
  res.unsupportedMediaType = function(message) {
    failureResponse.message = message;
    res.status(415).json(failureResponse);
  }

  // 5XX
  res.internalServerError = function(message) {
    failureResponse.message = message;
    res.status(500).json(failureResponse);
  }

  next();
}
