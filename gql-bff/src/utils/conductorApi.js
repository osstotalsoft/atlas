const { removeQuotes } = require("./functions");
const { NoCacheRESTDataSource } = require("./noCacheRESTDataSource");

class ConductorApi extends NoCacheRESTDataSource {
  constructor() {
    super();
    this.baseURL = removeQuotes(`${process.env.BASE_API_URL}`);
  }
}

module.exports = ConductorApi;
