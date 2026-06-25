const jsonwebtoken = require("jsonwebtoken");
const { tenantService } = require("@totalsoft/tenant-configuration");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT || "false");

const tenantIdentification = () => async (req, _res, next) => {
  try {
    if (!req.tenant) {
      if (!isMultiTenant) {
        req.tenant = {};
        next();
        return;
      }

      const tenantId = getTenantIdFromJwt(req) ?? getTenantIdFromHeaders(req);

      req.tenant = await tenantService.getTenantFromId(tenantId);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const getTenantIdFromHeaders = (req) => req.headers.tenantid;

const getTenantIdFromJwt = ({ token }) => {
  let tenantId = null;
  if (token) {
    const decoded = jsonwebtoken.decode(token.replace("Bearer ", ""));
    if (decoded) {
      tenantId = decoded.tid;
    }
  }
  return tenantId;
};

module.exports = tenantIdentification;
