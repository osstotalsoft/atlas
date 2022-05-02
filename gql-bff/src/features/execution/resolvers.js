const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);

const executionResolvers = {
  Query: {
    getExecution: async (_parent, { workflowId }, { dataSources }, _info) => {
      return await dataSources?.executionApi?.getExecution(workflowId);
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
  Mutation: {
    executeWorkflow: async (_parent, { requestInput }, context) => {
      const { dataSources, tenantId } = context;
      const body = {
        ...requestInput,
        input: { Headers: { ...requestInput?.input?.Headers, tenantId } },
      };
      return await dataSources.executionApi.executeWorkflow(body);
    },
  },
};

module.exports = executionResolvers;
