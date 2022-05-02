const { userCanSeeResource } = require("../common/functions");

const updateHandlerCondition = (initialCondition, isMultiTenant, tenantId) => {
  let condArray = new Array();

  if (isMultiTenant) condArray.push(`\$.Headers.TenantId === '${tenantId}'`);
  if (initialCondition) condArray.push(initialCondition);

  return condArray.join(" && ");
};

const getTenantIdFromHandler = (condition) => {
  //get the tenant condition
  const tenantConditionExp = RegExp(`\\$\\.Headers\.TenantId === '[\\w-]+'`);
  const match = condition?.match(tenantConditionExp);

  //get the tenantId
  var tenantIdExp = /'(.*?[^\\])'/g;
  return match ? tenantIdExp.exec(match)[1] : null;
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
