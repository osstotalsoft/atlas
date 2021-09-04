const { esClient, esSchema } = require('./client')

function generateFilters(filters) {
  return Object.keys(filters).map(key => {
    if (key === 'timeStamp') {
      const range = {
        timeStamp: {
          gte: filters[key]?.split('T')[0],
          lte: filters[key]?.split('T')[0],
          format: 'yyyy-MM-dd'
        }
      }
      return { range }
    }
    let match = {}
    match[key] = filters[key]
    return { match }
  })
}

function getQueryParams(filters) {
  const isFiltered = filters ? Object.keys(filters)?.length > 0 : false
  return isFiltered
    ? {
        bool: {
          filter: generateFilters(filters)
        }
      }
    : {
        match_all: {}
      }
}

function search(index, type, filters) {
  // perform the actual search passing in the index, the search query and the type
  return new Promise(resolve => {
    const body = {
      ...esSchema,
      query: getQueryParams(filters)
    }
    esClient.search({ index, type, body }).then(r => {
      const _source = [...r['hits']['hits']]
      const result = _source.map((item, i) => (_source[i] = item._source))
      resolve(result)
    })
  })
}

function seed(index, type, inputList) {
  const body = []
  inputList.forEach(row => {
    const { id } = row
    body.push({ index: { _index: index, _type: type, _id: id } }, row)
  })

  esClient.bulk({
    index,
    type,
    body
  })
}

module.exports = {
  search,
  seed
}
