const tenantConfiguration = require("./tenantConfiguration");

function getTenantFromId(tenantId) {
  if (!tenantId) {
    return null;
  }

  const configTenant = tenantConfiguration.getValue(tenantId);

  const tenant = {
    id: tenantId,
    name: configTenant.name,
    code: configTenant.code
  };
  return tenant;
}

function getTenantFromHost(_host) {
  throw new Error("getTenantFromHost not supported");
}

module.exports = { getTenantFromId, getTenantFromHost };
