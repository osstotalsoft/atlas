const { Client: Client6 } = require("es6");

const { snapshots_body6, logs_body6 } = require("./config");
const { elasticLogs, workflowSnapshots } = require("./registeredIndexes");

const { ELASTIC_SEARCH_HOST, ELASTIC_USER, ELASTIC_PASSWORD, ELASTIC_VERSION } =
  process.env;

const esSchema = {
  size: 1000,
  from: 0,
  track_total_hits: false,
  query: {
    match_all: {},
  },
};

const esClient = new Client6({
  node: ELASTIC_SEARCH_HOST,
  auth: {
    username: ELASTIC_USER,
    password: ELASTIC_PASSWORD,
  },
  pingTimeout: 60000,
});

const initElastic = async () => {
  var res = await esClient.ping();
  if (res?.body) {
    initializeIndex(workflowSnapshots.index, snapshots_body6);
    initializeIndex(elasticLogs.index, logs_body6);
  }
};

async function initializeIndex(indexName, body) {
  const exists = await esClient.indices.exists({ index: indexName });
  if (exists?.body) console.log(`index "${indexName}" already created`);
  else {
    console.log(`index "${indexName}" is missing. Creating...`);
    await esClient.indices.create({
      include_type_name: true,
      index: indexName,
      body,
    });
    console.log(`index "${indexName}" created`);
  }
}

function generateMatchFilters(filters) {
  let matchArray = [];
  Object.keys(filters).map((key) => {
    let matchField = {};
    matchField[key] = filters[key];
    matchArray.push({ match: matchField });
  });
  return matchArray;
}

function getQueryParams(filters) {
  const isFiltered = filters ? Object.keys(filters)?.length > 0 : false;
  return isFiltered
    ? {
        bool: {
          must: generateMatchFilters(filters),
        },
      }
    : {
        match_all: {},
      };
}

function search(index, filters) {
  // perform the actual search
  return new Promise((resolve) => {
    const body = {
      ...esSchema,
      query: getQueryParams(filters),
    };
    esClient.search({ index, body }).then((res) => {
      const _source = res?.body?.hits?.hits;
      const result = _source.map((item, i) => (_source[i] = item._source));
      resolve(result);
    });
  });
}

function seed(index, type, inputList) {
  const body = [];
  inputList.forEach((row) => {
    const { id } = row;
    body.push({ index: { _index: index, _type: type, _id: id } }, row);
  });

  esClient.bulk({
    index,
    type,
    body,
  });
}

module.exports = {
  esSchema,
  esClient,
  initElastic,
  search,
  seed,
};
