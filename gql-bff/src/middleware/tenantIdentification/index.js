const jsonwebtoken = require("jsonwebtoken");
const { tenantService } = require("../../multiTenancy");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);

const tenantIdentification = () => async (ctx, next) => {
  if (!ctx.tenantId) {
    if (!isMultiTenant) {
      ctx.tenantId = null;
      await next();
      return;
    }

    const tenantId = getTenantIdFromJwt(ctx);
    if(!tenantId) throw new Error('Tenant Id was not provided while the application is configured as multitenant.')
    ctx.tenantId = await tenantService.getTenantFromId(tenantId)?.id;
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
