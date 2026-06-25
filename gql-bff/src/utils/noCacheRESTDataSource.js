const { RESTDataSource } = require('@apollo/datasource-rest')

class NoCacheRESTDataSource extends RESTDataSource {
  constructor(config) {
    super(config)
    // Disable per-request GET memoization (replaces the v3 cache-deletion overrides).
    this.memoizeGetRequests = false
  }
}

module.exports = { NoCacheRESTDataSource }
