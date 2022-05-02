const { esClient, esSchema } = require("./client");

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
    esClient.search({ index, body }).then(({ body }) => {
      const _source = [...body["hits"]["hits"]];
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
  search,
  seed,
};
