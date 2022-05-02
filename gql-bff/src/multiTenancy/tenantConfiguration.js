const { existsSync, readFileSync } = require("fs");
const objectPath = require("object-path");
const humps = require("humps");

const multitenancySectionName = "multiTenancy";

let _tenancyConfigurationSection;
let _tenantMap = {};

function getValue(tenantId, key) {
    const defaultSection = _tenancyConfigurationSection["defaults"];
    const section = _tenantMap[tenantId?.toLowerCase()];

    if (!section) throw new Error(`Configuration not found for tenant '${tenantId}'`);

    return objectPath.get(section, key) || objectPath.get(defaultSection, key);
}

function _initialize() {
    const configFileName = "tenants.json";

    const configFileExists = existsSync(configFileName);
    if (!configFileExists) throw new Error(`Tenant configuration file '${configFileName}' could not be found`);

    const data = readFileSync(configFileName, "utf8");
    const globalConfiguration = humps.camelizeKeys(JSON.parse(data));

    _tenancyConfigurationSection = globalConfiguration[multitenancySectionName];
    if (!_tenancyConfigurationSection)
        throw new Error(
            `Tenancy not configured. Add the '${multitenancySectionName}' section to the '${configFileName} file'.`
        );

    _loadTenants();
}

function _loadTenants() {
    const tenants = _tenancyConfigurationSection["tenants"];

    for (const tenantSection of tenants) {
        const tid = tenantSection["tenantId"]?.toLowerCase();
        _tenantMap[tid] = tenantSection;
    }
}

_initialize();

module.exports = { getValue };
