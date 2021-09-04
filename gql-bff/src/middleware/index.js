const validateToken = require('./auth/auth')
const errorHandlingMiddleware = require('./errorHandling/errorHandlingMiddleware')

module.exports = {
  ...validateToken,
  errorHandlingMiddleware
}
