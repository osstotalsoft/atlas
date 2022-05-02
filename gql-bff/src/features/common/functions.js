const { flatten } = require("ramda");
const { isNil, includes } = require("ramda");
const { globalAdmin, admin } = require("./../../constants/identityUserRoles");

const isGlobalAdmin = (externalUser) => {
  return includes(globalAdmin, flatten([externalUser?.role]));
};

const isTenantAdmin = (externalUser) => {
  return includes(admin, flatten([externalUser?.role]));
};

const getTenantIdFromDescription = (description) => {
  try {
    return JSON.parse(description || "null")?.tenantId;
  } catch {
    return null;
  }
};

const userCanSeeResource = (resTenantId, ctxTenantId) => {
  if (isNil(resTenantId)) return true;
  return resTenantId === ctxTenantId;
};

const userCanEditResource = (resTenantId, externalUser) => {
  if (!userCanSeeResource(resTenantId, externalUser?.tenantId)) return false;
  if (isGlobalAdmin(externalUser)) return true;
  if (isTenantAdmin(externalUser)) {
    return isNil(resTenantId) ? false : true;
  }
  return false;
};

const filterResourcesByTenant = (list, tenantId) => {
  return list?.filter((res) => {
    const resTenantId = getTenantIdFromDescription(res?.description);
    if (userCanSeeResource(resTenantId, tenantId)) return res;
  });
};

module.exports = {
  isGlobalAdmin,
  isTenantAdmin,
  getTenantIdFromDescription,
  userCanSeeResource,
  userCanEditResource,
  filterResourcesByTenant,
};
