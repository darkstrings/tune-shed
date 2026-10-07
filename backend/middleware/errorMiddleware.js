export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
}

// Express 5 forwards rejected promises from async handlers here automatically.
export function errorHandler(err, req, res, _next) {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request is too large";
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    message: status >= 500 && process.env.NODE_ENV === "production" ? "Something went wrong" : message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
}
