const errorHandlingMiddleware = () => async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    throw new Error(`Error occurred while processing the request: ${error.stack}`, error)
  }
}

module.exports = errorHandlingMiddleware
