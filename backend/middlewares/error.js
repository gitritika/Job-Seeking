class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}


export const errorMiddleware = (err, req, res, next) => {
  // Ensure that err is always an object with a message property
  if (typeof err === 'string') {
    err = new ErrorHandler(err, 500);
  } else if (!(err instanceof ErrorHandler)) {
    const message = err.message || "Internal Server Error";
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, 400);
  }
  if (err.message === 'Must supply api_key') {
    const message = 'API key is missing';
    const statusCode = err.statusCode || 500;
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;