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

const getImportData = (input, replacements) => {
  let tempData = input;
  const replace = JSON.parse(replacements);
  Object.keys(replace).forEach((key) => {
    if (key === "{{NatsPrefix}}" && !tempData.includes(key)) {
      tempData = tempData.replaceAll(
        "nats_stream:ch.",
        `nats_stream:${replace[key]}ch.`
      );
    }
    tempData = tempData.replaceAll(key, replace[key]);
  });

  return JSON.parse(tempData);
};

const getTenantImportData = (input, replacements, tenant) => {
  const { code, id } = tenant;
  const replace = JSON.parse(replacements);
  let tempData = input;
  Object.keys(replace).forEach((key) => {
    if (key === "{{NamePrefix}}") {
      if (replace[key].startsWith(code.toUpperCase())) {
        tempData = tempData.replaceAll(
          key,
          `${replace[key]}`
        );
      } else {
        tempData = tempData.replaceAll(
          key,
          `${code.toUpperCase()}_${replace[key]}`
        );
      }
      
    } else {
      tempData = tempData.replaceAll(key, replace[key]);
    }
  });

  return JSON.parse(tempData);
};

const getDescription = (data) => {
  try {
    const desc = JSON.parse(data);
    return desc.description;
  } catch {
    return data;
  }
};
const getWorkflowDescription = (flow, tenantId, isMultiTenant) => {
  if (isMultiTenant) {
    return JSON.stringify({
      description: getDescription(flow.description),
      tenantId: tenantId,
    });
  } else {
    return getDescription(flow.description);
  }
};

const updateHandlerCondition = (initialCondition, isMultiTenant, tenantId) => {
  let condArray = new Array();

  if (isMultiTenant) {
    if (initialCondition.includes("$.Headers['nbb-tenantId']")) {
      const tempConditions = initialCondition.split("&&").map((a) => a.trim());
      const tempNewCondictions = new Array();
      for (cond of tempConditions) {
        if (cond.startsWith("$.Headers['nbb-tenantId']")) {
          tempNewCondictions.push(
            `\$.Headers['nbb-tenantId'] === '${tenantId}'`
          );
        } else {
          tempNewCondictions.push(cond);
        }
      }

      return tempNewCondictions.join(" && ");
    } else {
      condArray.push(`\$.Headers['nbb-tenantId'] === '${tenantId}'`);
      return condArray.join(" && ");
    }
  } else {
    if (initialCondition.includes("$.Headers['nbb-tenantId']")) {
      const tempConditions = initialCondition.split("&&").map((a) => a.trim());
      return tempConditions
        .filter((a) => !a.startsWith("$.Headers['nbb-tenantId']"))
        .join(" && ");
    } else {
      return initialCondition;
    }
  }
};

module.exports = {
  isGlobalAdmin,
  isTenantAdmin,
  getTenantIdFromDescription,
  userCanSeeResource,
  userCanEditResource,
  filterResourcesByTenant,
  getImportData,
  getTenantImportData,
  getWorkflowDescription,
  updateHandlerCondition,
};
