function errorHandler(err, req, res, next) {
  console.log("here is the errror handler");
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
}

export default errorHandler;
