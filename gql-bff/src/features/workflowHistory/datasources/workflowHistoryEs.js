const {
  indexes: { workflowSnapshots },
  elastic,
} = require("../../../elasticSearch");

const getWorkflowHistory = async (workflowName, version) => {
  const { index } = workflowSnapshots;
  const hits = await elastic.search(index, { workflowName, version });
  return hits.map(a => ({...a, definition: JSON.parse(a.definition)}));
};

module.exports = { getWorkflowHistory };
