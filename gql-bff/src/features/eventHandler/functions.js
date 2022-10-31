const { userCanSeeResource } = require("../common/functions");

const updateHandlerCondition = (initialCondition, isMultiTenant, tenantId) => {
  let condArray = new Array();

  if (isMultiTenant) condArray.push(`\$.Headers['nbb-tenantId']==='${tenantId}'`);
  if (initialCondition) condArray.push(initialCondition);

  return condArray.join(" && ");
};

const getTenantIdFromHandler = (condition) => {
  //get the tenant condition
  const tenantConditionExp = RegExp(`\\$\\.Headers\\['nbb-tenantId'\\]==='([\\w-]+)'`);
  const match = condition?.match(tenantConditionExp);

  //get the tenantId
  //var tenantIdExp = /'(.*?[^\\])'/g;
  return match ? match[1] : null;
};

const filterEvHandlersByTenant = (list, tenantId) => {
  return list?.filter((res) => {
    const resTenantId = getTenantIdFromHandler(res?.condition);
    if (userCanSeeResource(resTenantId, tenantId)) return res;
  });
};

module.exports = {
  updateHandlerCondition,
  getTenantIdFromHandler,
  filterEvHandlersByTenant,
};
