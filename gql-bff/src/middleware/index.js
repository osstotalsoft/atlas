const validateToken = require("./auth/auth");
const errorHandlingMiddleware = require("./errorHandling/errorHandlingMiddleware");
const tenantIdentification = require("./tenantIdentification");

module.exports = {
  ...validateToken,
  tenantIdentification,
  errorHandlingMiddleware,
};
