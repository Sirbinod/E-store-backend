function errorHandler(err, req, res, next) {
  // jwt authentication error
  if (err.name === "UnauthorizedError") {
    return res
      .status(403)
      .json({success: false, message: "The user not authorized"});
  }
  //   default to 500 server error
  return res.status(500).json({success: false, err});
}
module.exports = errorHandler;
