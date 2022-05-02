const { Client } = require("@elastic/elasticsearch");
const { snapshots_body, logs_body } = require("./config");
const { elasticLogs, workflowSnapshots } = require("./registeredIndexes");

const { ELASTIC_SEARCH_HOST } = process.env;

const esSchema = {
  size: 1000,
  from: 0,
  track_total_hits: false,
  query: {
    match_all: {},
  },
};

const esClient = new Client({
  node: ELASTIC_SEARCH_HOST,
  pingTimeout: 60000,
});

async function initializeIndex(indexName, body) {
  const { body: exists } = await esClient.indices.exists({ index: indexName });
  if (exists) console.log(`index "${indexName}" already created`);
  else {
    console.log(`index "${indexName}" is missing. Creating...`);
    await esClient.indices.create({
      index: indexName,
      body,
    });
    console.log(`index "${indexName}" created`);
  }
}

esClient.ping(function (error) {
  if (error) throw new TypeError("ElasticSearch cluster is down!");
  else {
    initializeIndex(workflowSnapshots.index, snapshots_body);
    initializeIndex(elasticLogs.index, logs_body);
    console.log("ElasticSearch is ok");
  }
});

module.exports = {
  esSchema,
  esClient,
};
