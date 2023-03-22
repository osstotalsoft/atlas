const { ELASTIC_VERSION } = process.env;

if (+ELASTIC_VERSION === 6) {
  const {
    esSchema,
    esClient,
    initElastic,
    search,
    seed,
  } = require("./clientes6");

  module.exports = {
    esSchema,
    esClient,
    initElastic,
    search,
    seed,
  };
} else {
  const {
    esSchema,
    esClient,
    initElastic,
    search,
    seed,
  } = require("./clientes8");

  module.exports = {
    esSchema,
    esClient,
    initElastic,
    seed,
    search,
  };
}
