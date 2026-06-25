// Express error-handling middleware (4-arg signature).
const errorHandlingMiddleware = () => (error, _req, res, _next) => {
  // express-jwt rejects invalid/missing credentials with an UnauthorizedError.
  if (error && (error.name === "UnauthorizedError" || error.status === 401)) {
    return res.status(401).json({ error: error.message || "Unauthorized" });
  }

  console.error(
    `Error occurred while processing the request: ${error?.stack ?? error}`
  );
  return res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandlingMiddleware;
