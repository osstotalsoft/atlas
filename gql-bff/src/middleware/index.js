const validateToken = require("./auth/auth");
const tenantIdentification = require("./tenantIdentification");
const errorHandlingMiddleware = require("./errorHandling/errorHandlingMiddleware");

module.exports = {
  ...validateToken,
  tenantIdentification,
  errorHandlingMiddleware,
};
