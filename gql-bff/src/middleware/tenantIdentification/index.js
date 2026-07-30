const { tenantService } = require("@totalsoft/tenant-configuration");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT || "false");
const isDevelopment = process.env.NODE_ENV === "development";

const tenantIdentification = () => async (req, _res, next) => {
  try {
    if (!req.tenant) {
      if (!isMultiTenant) {
        req.tenant = {};
        next();
        return;
      }

      const tenantId = getTenantId(req);

      req.tenant = await tenantService.getTenantFromId(tenantId);
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * The tenant comes from the verified JWT claim only. The `tenantid` header is
 * caller-controlled, so honouring it would let any authenticated user read
 * another tenant's data; it survives purely as a local development convenience
 * for the anonymous case.
 */
const getTenantId = (req) => {
  const tenantIdFromJwt = req.auth?.tid;
  if (tenantIdFromJwt) {
    return tenantIdFromJwt;
  }

  return isDevelopment ? req.headers.tenantid : null;
};

module.exports = tenantIdentification;
