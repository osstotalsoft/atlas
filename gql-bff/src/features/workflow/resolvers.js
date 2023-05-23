const { saveSnapshot } = require("./dataSources/workflowEs");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const { ForbiddenError } = require("apollo-server-koa");
const {
  userCanSeeResource,
  getTenantIdFromDescription,
  userCanEditResource,
  filterResourcesByTenant,
} = require("../common/functions");

const workflowResolvers = {
  Query: {
    getWorkflow: async (_parent, { name, version }, context, _info) => {
      const { dataSources, tenant } = context;

      const workflow = await dataSources.workflowApi.getWorkflow(name, version);
      if (!isMultiTenant) return workflow;

      const wfTenantId = getTenantIdFromDescription(workflow?.description);
      if (userCanSeeResource(wfTenantId, tenant?.id)) {
        return workflow;
      } else
        return new ForbiddenError(
          "You are not authorized to see this workflow."
        );
    },

    getWorkflowList: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      if (!isMultiTenant) return allWorkflows;
      else return filterResourcesByTenant(allWorkflows, tenant?.id);
    },
  },

  WorkflowDef: {
    readOnly: (parent, _args, context, _info) => {
      if (!isMultiTenant) return false;

      const { externalUser } = context;
      const wfTenantId = getTenantIdFromDescription(parent?.description);

      return !userCanEditResource(wfTenantId, externalUser);
    },
    description: (parent, _args, _info) => {
      try {
        return JSON.parse(parent?.description)?.description;
      } catch {
        return parent?.description;
      }
    },
  },
  Mutation: {
    createOrUpdateWorkflow: async (_parent, { input }, context) => {
      const { dataSources, externalUser } = context;
      const body = {
        ...input,
        description: JSON.stringify({
          description: input?.description,
          tenantId: isGlobalAdmin(externalUser) ? null : externalUser?.tenantId,
        }),
      };

      //Create or Update workflow in Conductor
      await dataSources.workflowApi.createOrUpdateWorkflow(
        JSON.stringify([body])
      );

      //Create or Update History Snapshot in Elastic
      const result = await await dataSources.workflowApi.getWorkflow(
        input?.name,
        input?.version
      );
      saveSnapshot(result);
    },
  },
};

module.exports = workflowResolvers;
