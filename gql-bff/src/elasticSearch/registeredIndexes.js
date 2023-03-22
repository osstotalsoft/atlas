const { ELASTIC_PREFIX } = process.env;

module.exports = {
  elasticLogs: {
    index: `${ELASTIC_PREFIX}_logs`,
    type: "_doc",
  },
  workflowSnapshots: {
    index: `${ELASTIC_PREFIX}_snapshots`,
    type: "_doc",
  },
};
