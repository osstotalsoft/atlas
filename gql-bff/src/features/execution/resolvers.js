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
      const { dataSources, tenantId } = context;

      const execution = await dataSources?.executionApi?.getExecution(
        workflowId
      );
      const executionTenantId = execution?.input?.Headers?.tenantId;

      if (!isMultiTenant) return execution;

      if (userCanSeeResource(executionTenantId, tenantId)) {
        return execution;
      } else
        return new ForbiddenError(
          "You are not authorized to see this event handler."
        );
    },

    getExecutionList: async (_parent, args, context, _info) => {
      const { dataSources, tenantId } = context;

      let queryArray = new Array();
      if (args?.query) queryArray.push(args?.query);
      if (isMultiTenant) queryArray.push(`input='(tenantId=${tenantId})'`);

      const query = queryArray.join("AND");

      const newArgs = { ...args, query };
      const res = await dataSources?.executionApi?.getExecutionList(newArgs);

      return res;
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
      const { dataSources, tenantId } = context;
      const body = {
        ...requestInput,
        input: {
          ...requestInput?.input,
          Headers: { ...requestInput?.input?.Headers, tenantId },
        },
      };
      return await dataSources.executionApi.executeWorkflow(body);
    },
  },
};

module.exports = executionResolvers;
