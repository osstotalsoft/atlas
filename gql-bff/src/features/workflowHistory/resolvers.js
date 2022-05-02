const { getWorkflowHistory } = require("./datasources/workflowHistoryEs");

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
  },
  WorkflowHistory: {
    definition: (parent, _args, _context, _info) => {
      return { ...parent?.definition, historyId: parent?.snapshotNumber };
    },
  },
};

module.exports = workflowHistoryResolvers;
