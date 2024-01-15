const { getWorkflowHistory } = require("./datasources/workflowHistoryEs");
const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT);
const { filterResourcesByTenant } = require("../common/functions");

const workflowHistoryResolvers = {
  Query: {
    workflowHistory: async (
      _parent,
      { workflowName, version },
      _context,
      _info
    ) => {
      return await getWorkflowHistory(workflowName, version);
    },

    allWorkflowHistory: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      const flows = isMultiTenant
        ? filterResourcesByTenant(allWorkflows, tenant?.id)
        : allWorkflows;

      const history = {};
      for (const flow of flows) {
        const flowHistory = await getWorkflowHistory(flow.name, flow.version);

        if (flowHistory.length <= 1) continue;
        const latest = flowHistory.sort((a, b) =>
          a.timeStamp > b.timeStamp ? -1 : 1
        )[1];
        if (
          JSON.stringify({
            ...latest.definition,
            updateTime: undefined,
            createTime: undefined,
          }) ===
          JSON.stringify({
            ...flow,
            updateTime: undefined,
            createTime: undefined,
          })
        )
          continue;

        history[`${flow.name}_${flow.version}`] = {
          current: flow,
          latest: flowHistory.sort((a, b) =>
            a.timeStamp > b.timeStamp ? -1 : 1
          )[1],
        };
      }
      return history;
    },
    allExecutionHistory: async (_parent, _args, context, _info) => {
      const { dataSources, tenant } = context;
      const allWorkflows = await dataSources.workflowApi.getWorkflowList();
      const flows = isMultiTenant
        ? filterResourcesByTenant(allWorkflows, tenant?.id)
        : allWorkflows;

      const history = {};
      for (const flow of flows) {
        const flowHistory = await dataSources?.executionApi?.getExecutionList({
          size: 1,
          sort: "startTime:DESC",
          start: 0,
          freeText: `(workflowType: ${flow.name} AND version: ${flow.version})`,
        });

        history[`${flow.name}/${flow.version}`] = flowHistory.totalHits;
      }

      return history;
    },
  },
  WorkflowHistory: {
    definition: (parent, _args, _context, _info) => {
      return { ...parent?.definition, historyId: parent?.snapshotNumber };
    },
  },
};

module.exports = workflowHistoryResolvers;
