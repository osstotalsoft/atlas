const elasticsearch = require('elasticsearch')
const { ELASTIC_SEARCH_HOST, ELASTIC_SEARCH_API_VERSION, ELASTIC_SEARCH_LOGGING_LEVEL } = process.env

const esSchema = {
  size: 1000,
  from: 0,
  track_total_hits: false,
  query: {
    match_all: {}
  }
}

const esClient = new elasticsearch.Client({
  host: ELASTIC_SEARCH_HOST,
  apiVersion: ELASTIC_SEARCH_API_VERSION,
  log: ELASTIC_SEARCH_LOGGING_LEVEL?.toLowerCase() ?? 'error'
})

esClient.ping(
  {
    requestTimeout: 30000
  },
  function (error) {
    if (error) throw new TypeError('ElasticSearch cluster is down!')
    else console.log('ElasticSearch is ok')
  }
)

module.exports = {
  esSchema,
  esClient
}
