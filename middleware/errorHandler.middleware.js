// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  // Handle different types of errors
  if (err.name === "ValidationError") {
    // Handle validation errors (e.g., Joi validation)
    return res
      .status(400)
      .json({ error: "Validation error", details: err.details });
  } else if (err.name === "MulterError") {
    // Handle Multer errors
    return res
      .status(400)
      .json({ error: "File upload error", details: err.message });
  } else {
    // Handle other errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = errorHandler;
