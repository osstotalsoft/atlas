const ConductorApi = require("../../../utils/conductorApi");

class WorkflowApi extends ConductorApi {
  async createOrUpdateWorkflow(body) {
    return await this.put(`api/metadata/workflow`, body, {
      headers: { "content-type": "application/json" },
    });
  }

  async getWorkflow(name, version) {
    return await this.get(`/api/metadata/workflow/${name}?version=${version}`);
  }

  async getWorkflowList() {
    return await this.get(`/api/metadata/workflow/`);
  }
}

module.exports = WorkflowApi;
