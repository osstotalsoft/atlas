const jsonwebtoken = require("jsonwebtoken");
const { tenantService } = require("@totalsoft/tenant-configuration");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT || "false");

const tenantIdentification = () => async (ctx, next) => {
  if (!ctx.tenant) {
    if (!isMultiTenant) {
      ctx.tenant = {};
      await next();
      return;
    }

    const tenantId = getTenantIdFromJwt(ctx);

    ctx.tenant = await tenantService.getTenantFromId(tenantId);
  }
  await next();
};

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
