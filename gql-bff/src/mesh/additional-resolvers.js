// env
const dotenv = require("dotenv");
const result = dotenv.config();
const fetch = require("node-fetch");

if (result.error) {
  const path = `.env`;
  dotenv.config({ path });
}

const {
  elastic,
  indexes: { elasticLogs },
} = require("../elasticSearch");
const { generateEventHandlerModel } = require("../utils/functions");

module.exports = {
  Query: {
    log: async (_parent, { logId }, _ctx, _info) => {
      const res = await elastic.search(elasticLogs.index, elasticLogs.type, {
        id: logId,
      });
      return res[0];
    },
    getWorkflow: async (_parent, { name }, context, _info) => {
      const res = await fetch(
        `${context.baseApiUrl}/api/metadata/workflow/${name}`
      );
      return await res.json();
    },
    getExecution: async (_parent, { workflowId }, context, _info) => {
      const res = await fetch(
        `${context.baseApiUrl}/api/workflow/${workflowId}`
      );
      return await res.json();
    },
    getEventHandlersForSink: async (_parent, { event, activeOnly }, context, _info) => {
      const encodedUri = `${context.baseApiUrl}/api/event/${encodeURIComponent(event)}?activeOnly=${activeOnly}`;
      const response = await fetch(encodedUri).then((o) => o.json());
      const responseModel = response.map(generateEventHandlerModel);
      return responseModel;
    },
  },
};
