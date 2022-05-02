const { getLog } = require("./dataSources/logsEs");

const logsResolvers = {
  Query: {
    log: async (_parent, { logId }, _ctx, _info) => {
      return await getLog(logId);
    },
  },
};

module.exports = logsResolvers;
