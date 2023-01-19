const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const {
  userCanSeeResource,
  userCanEditResource,
} = require("../common/functions");
const { ForbiddenError } = require("apollo-server-koa");
const { omit } = require("ramda");

const executionResolvers = {
  Query: {
    getExecution: async (_parent, { workflowId }, context, _info) => {
      const { dataSources, tenant } = context;

      const execution = await dataSources?.executionApi?.getExecution(
        workflowId
      );
      if (!isMultiTenant) return execution;

      const executionTenantId = execution?.input?.Headers?.tenantId;
      if (userCanSeeResource(executionTenantId, tenant?.id)) {
        return execution;
      } else
        return new ForbiddenError(
          "You are not authorized to see this execution."
        );
    },

    getExecutionList: async (_parent, args, context, _info) => {
      const { dataSources, tenant } = context;

      let queryArray = new Array();
      if (args?.query) queryArray.push(args?.query);
      if (isMultiTenant) queryArray.push(`input='(tenantId=${tenant?.id})'`);

      const query = queryArray.join("AND");
      const newArgs = { ...args, query };
      return await dataSources?.executionApi?.getExecutionList(newArgs);
    },
  },
  Workflow: {
    readOnly: (parent, _args, { externalUser }, _info) => {
      if (!isMultiTenant) return false;

      const exTenantId = parent?.input?.Headers?.tenantId;
      return !userCanEditResource(exTenantId, externalUser);
    },
    input: (parent, _args, context, _info) => {
      const newInput = {
        ...parent.input,
        Headers: omit(["tenantId"], parent?.input?.Headers),
      };
      return newInput;
    },
  },
  Mutation: {
    executeWorkflow: async (_parent, { requestInput }, context) => {
      const { dataSources, tenant } = context;
      const body = {
        ...requestInput,
        input: {
          ...requestInput?.input,
          Headers: { ...requestInput?.input?.Headers, tenantId: tenant?.id },
        },
      };
      return await dataSources.executionApi.executeWorkflow(body);
    },
  },
};

module.exports = executionResolvers;
