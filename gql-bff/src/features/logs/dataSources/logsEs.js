const {
  indexes: { elasticLogs },
  elastic,
} = require("../../../elasticSearch");

const getLog = async (logId) => {
  const res = await elastic.search(elasticLogs.index, {
    id: logId,
  });
  return res[0];
};

module.exports = { getLog };
